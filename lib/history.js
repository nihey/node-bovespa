var parseString = require('node-jquery-deparam'),
    pf = require('./utils/parse-float'),
    arraify = require('./utils/arraify'),
    getURL = require('./utils/get-url');

module.exports = function(code, callback) {
  var url = 'http://www.bmfbovespa.com.br/Pregao-Online/ExecutaAcaoCarregarDadosPapeis.asp';
  getURL(url, {CodDado: code}, function(data) {
    var parsed = parseString(data.toString());
    callback(parsed.V && {
      date: parsed.D,
      traded: parsed.V.split('|').slice(0, -1).map(function(trade) {
        var split = trade.split('@');
        return {
          time: split[0],
          value: split[1],
          oscillation: split[2],
        };
      }),
    });
  });
}
