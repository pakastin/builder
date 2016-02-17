
var cp = require('child_process');

var chalk = require('chalk');
var chokidar = require('chokidar');

function builder (cb) {
  cb(exec, watch);
}

exec('npm start');

module.exports = builder;
builder.exec = exec;
builder.watch = watch;

function exec (cmd) {
  console.log(chalk.cyan('exec'), chalk.grey(cmd));

  var split = cmd.split(' ');

  var args = new Array(arguments.length - 1);

  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i + 1];
  }

  var childProcess = cp.spawn(split[0], split.slice(1));
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
  childProcess.on('exit', function (code) {
    if (code > 0) {
      console.log(chalk.red(chalk.bold('fail')), chalk.grey(cmd));
      return;
    }
    console.log(chalk.green(chalk.bold('done')), chalk.grey(cmd));

    if (args.length) {
      exec.apply(this, args);
    }
  });
}

function watch (path) {
  console.log(chalk.yellow('watching'), chalk.grey(path));
  var args = new Array(arguments.length - 1);

  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i + 1];
  }

  chokidar.watch(path)
    .on('change', function (path) {
      if (~path.indexOf('node_modules')) {
        return;
      }
      console.log(chalk.yellow(chalk.bold('changed')), chalk.grey(path));
      exec.apply(this, args);
    });
}
