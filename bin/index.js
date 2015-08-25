#!/usr/bin/env node

var meow = require('meow'),
    bovespa = require('../lib');

var cli = meow({
  pkg: require('../package.json'),
  help: [
    'Usage',
    '  bovespa <symbol>...',
  ]
});

if (!cli.input.length) {
  cli.showHelp();
}

bovespa.quotes(cli.input, function(quotes) {
  console.log(quotes);
});
