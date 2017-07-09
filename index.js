'use-strict';

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const blogRoutes = require('./blog/routes/blogRoutes');
const { HOST, PORT, DATABASE_URL } = require('./config');

const app = express();
let server;

// Check for mongoose connection.
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Mongo!');
});

mongoose.Promise = global.Promise;

app.use(morgan('common'));
app.use('/posts', blogRoutes);

app.get('/', (req, res) => res.sendFile(path.join(`${__dirname}/blog/views/index.html`)));

app.use('*', (req, res) => {
  res.status(404).json({message: 'Not Found.'});
});

// Run server. Best setup for tests.
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(PORT, () => {
        console.log(`Serving at ${HOST}:${PORT}.`);
        resolve(server);
      }).on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// Close server. Best setup for tests.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server...');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// Run only if called by nodeJS itself.
if (require.main === module) {
  runServer().catch(err => console.error(err, 'There was an error running the server'));
}

// Export server and app.
module.exports = {
  runServer,
  closeServer,
  app
};
