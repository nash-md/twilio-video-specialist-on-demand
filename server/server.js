'use strict';

require('dotenv').config();

const loopback = require('loopback');
const boot = require('loopback-boot');
const app = (module.exports = loopback());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');

    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);

    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

boot(app, __dirname, function(err) {
  if (err) {
    throw err;
  }
  if (require.main === module) {
    app.start();
  }
});
