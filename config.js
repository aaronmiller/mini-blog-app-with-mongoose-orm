'use-strict';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 1337;
const DATABASE_URL = process.env.DATABASE_URL ||
                     global.DATABASE_URL ||
                     'mongodb://localhost/mini-blog-app';

module.exports = {
  HOST,
  PORT,
  DATABASE_URL
};
