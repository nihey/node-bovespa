#!/usr/bin/env node

var meow = require('meow'),
    bovespa = require('../lib');

var cli = meow({
  pkg: require('../package.json'),
  help: [
    'Usage',
    '  bovespa <symbol> [options]',
    '',
    'Options:',
    '  -q, --quote      quote status (default option)',
    '  -v, --volume     traded volume data',
    '  -t, --trading    daily trading history',
    '  -s, --stats      bovespa daily status',
    '',
  ]
});

if (!cli.input.length && !(cli.flags.s || cli.flags.stats)) {
  cli.showHelp();
}

if (cli.flags.s || cli.flags.stats) {
  bovespa.stocks(function(stats) {
    console.log(stats);
  });
} else if (cli.flags.t || cli.flags.trading) {
  bovespa.history(cli.input[0], function(history) {
    console.log(history);
  });
} else if (cli.flags.v || cli.flags.volume) {
  bovespa.quote(cli.input[0], function(quote) {
    console.log(quote);
  });
} else {
  bovespa.quotes(cli.input, function(quotes) {
    console.log(quotes);
  });
}
