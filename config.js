'use-strict';

exports.HOST = process.env.HOST || 'localhost';
exports.PORT = process.env.PORT || 1337;
exports.DATABASE_URL = process.env.DATABASE_URL ||
                     global.DATABASE_URL ||
                     'mongodb://localhost/mini-blog-app';

// module.exports = {
//   HOST,
//   PORT,
//   DATABASE_URL
// };
