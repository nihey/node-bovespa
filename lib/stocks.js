var parseString = require('node-jquery-deparam'),
    pf = require('./utils/parse-float'),
    getURL = require('./utils/get-url');

module.exports = function(callback) {
  var url = 'http://www.bmfbovespa.com.br/Pregao-OnLine/ExecutaAcaoCarregarDados.asp';
  getURL(url, {CodDado: 'IBOV,Ticker'}, function(data) {
    var parsed = parseString(data.toString());
    callback(parsed.V && {
      date: parsed.D,
      status: parsed.s,
      points: {
        opening: parsed.A,
        mean: parsed.MD,
        min: parsed.MN,
        max: parsed.MX,
      },
      pointHistory: parsed.V.split('|').slice(0, -1).map(function(trade) {
        var split = trade.split('@');
        return {
          time: split[0],
          points: parseInt(split[1]),
          variation: parseFloat(split[2]),
        };
      }),
      lastTrades: parsed.v.split('|').slice(0, -1).map(function(trade) {
        var split = trade.split('@');
        var variations = {
          '#': 'up',
          '*': 'steady',
          '-': 'down',
        };
        return {
          symbol: split[0],
          value: parseFloat(split[1].substring(1)),
          variation: variations[split[1][0]],
        };
      }),
    });
  });
}
