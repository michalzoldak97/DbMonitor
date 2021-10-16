'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const app = require('./app');
const port = process.env.PORT || 3000;

process.on('uncaughtException', err => {
  console.log(`Uncaught exception: 
    name: ${err?.name} message: ${err?.message}`);
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(`Unhandled promise rejection: 
    name: ${err?.name} message: ${err?.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = {
  server
};
