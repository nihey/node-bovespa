#!/usr/bin/env node

var meow = require('meow'),
    bovespa = require('../lib'),
    log = require('../lib/utils/log'),
    pad = require('../lib/utils/pad');

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

var getColor = function(condition) {
  if (condition) {
    return 'green';
  }
  return 'red';
};

if (cli.flags.s || cli.flags.stats) {
  bovespa.stocks(function(stats) {
    stats = stats || {date: '', status: '', points: {}, pointHistory: [], lastTrades: []};

    log('date: ', 'bold'); log(stats.date, 'white'); log('\n');
    log('status: ', 'bold'); log(stats.status, 'white'); log('\n');

    var points = stats.points
    log('opening: ', 'bold'); log(points.opening, 'white');
    log(' ');
    log('mean: ', 'bold'); log(points.mean, getColor(points.mean >= points.opening));
    log(' ');
    log('min: ', 'bold'); log(points.min, getColor(points.min >= points.opening));
    log(' ');
    log('max: ', 'bold'); log(points.max, getColor(points.max >= points.opening));
    log(' ');

    log('\n');
    log('\n');
    log('Daily History: ', 'magenta'); log('\n');
    stats.pointHistory.forEach(function(stat) {
      pad(4);
      log('time: ', 'bold'); log(stat.time); log(' ');

      var padding = stat.variation >= 0 ? 1 : 0;
      var color = getColor(stat.variation >= 0);
      log('value: ', 'bold'); log(parseFloat(stat.points), color); log(' ');
      log('oscillation: ', 'bold'); pad(padding); log(stat.variation.toFixed(2), color); log(' ');

      log('\n');
    });

    log('\n');
    log('\n');
    log('Featured Trades: ', 'magenta'); log('\n');
    stats.lastTrades.forEach(function(stat) {
      pad(4);
      log('symbol: ', 'bold'); log(stat.symbol); log(' ');

      var color = getColor(stat.variation === 'up');
      if (stat.variation === 'steady') {
        color = 'yellow'
      }

      log('variation: ', 'bold'); log(stat.variation, color); log(' ');
      log('value: ', 'bold'); log(stat.value, getColor(stat.value >= 0)); log(' ');

      log('\n');
    });
    log('\n');
  });
} else if (cli.flags.t || cli.flags.trading) {
  bovespa.history(cli.input[0], function(history) {
    history = history || {data: '', traded: []};

    log('date: ', 'bold'); log(history.date, 'white');
    log('\n');
    history.traded.forEach(function(trade) {
      pad(4);
      log('time: ', 'bold'); log(trade.time); log(' ');

      var padding = trade.oscillation >= 0 ? 1 : 0;
      var color = getColor(trade.oscillation >= 0);
      log('value: ', 'bold'); log(parseFloat(trade.value).toFixed(2), color); log(' ');
      log('oscillation: ', 'bold'); pad(padding); log(trade.oscillation, color); log(' ');

      log('\n');
    });
    log('\n');
  });
} else if (cli.flags.v || cli.flags.volume) {
  bovespa.quote(cli.input[0], function(quote) {
    quote = quote || {};

    log('code: ', 'bold'); pad(7); log(quote.code + '\n', 'white');
    log('description: ', 'bold'); log(quote.description + '\n', 'white');
    log('datetime: ', 'bold'); pad(3); log(quote.datetime + '\n', 'white');
    log('delay: ', 'bold'); pad(6); log(quote.delay + '\n', 'white');
    log('ibovespa: ', 'bold'); pad(3); log((quote.ibovespa ? 'yes' : 'no') + '\n',
                                            quote.ibovespa ? 'blue' : 'white');
    var color = getColor(quote.oscillation >= 0);
    log('oscillation: ', 'bold'); log(quote.oscillation + '\n', color);
    log('volume: ', 'bold'); pad(5); log(quote.volume + '\n', getColor(quote.volume >= 0));
    log('type: ', 'bold'); pad(7); log(quote.type + '\n', 'cyan');
    log('\n');
  });
} else {
  bovespa.quotes(cli.input, function(quotes) {
    quotes = quotes || [];
    quotes.forEach(function(quote) {
      log('code: ', 'bold'); pad(7); log(quote.code + '\n', 'white');
      log('name: ', 'bold'); pad(7); log(quote.name + '\n', 'white');
      log('datetime: ', 'bold'); pad(3); log(quote.datetime + '\n', 'white');

      log('ibovespa: ', 'bold'); pad(3); log((quote.ibovespa ? 'yes' : 'no') + '\n',
                                             quote.ibovespa ? 'blue' : 'white');

      var opening = quote.opening
      log('opening: ', 'bold'); pad(4); log(opening + '\n');
      log('min: ', 'bold'); pad(8); log(quote.min + '\n', getColor(quote.min >= opening));
      log('max: ', 'bold'); pad(8); log(quote.max + '\n', getColor(quote.max >= opening));
      log('mean: ', 'bold'); pad(7); log(quote.mean + '\n', getColor(quote.mean >= opening));
      log('last: ', 'bold'); pad(7); log(quote.last + '\n', getColor(quote.last >= opening));

      var color = getColor(quote.oscillation >= 0);
      log('oscillation: ', 'bold'); log(quote.oscillation + '\n', color);
      log('\n');
    });
  });
}
