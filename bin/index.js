#!/usr/bin/env node

var exec = require('../src/index').exec;
var watch = require('../src/index').watch;

var fs = require('fs');

fs.readFile(process.cwd() + '/package.json', 'utf8', function (err, file) {
  if (err) {
    throw err;
  }
  var pckg = JSON.parse(file);
  var builder = pckg.builder || {};

  var cmds = builder.exec || [];
  var paths = builder.watch || {};

  for (var i = 0; i < cmds.length; i++) {
    exec('npm run ' + cmds[i]);
  }

  for (var key in paths) {
    watch.apply(this, [key].concat(paths[key].map(function (cmd) {
      return 'npm run ' + cmd;
    })));
  }
});
