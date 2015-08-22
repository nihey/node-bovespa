var parseXML = require('pixl-xml').parse,
    pf = require('./utils/parse-float'),
    arraify = require('./utils/arraify'),
    getURL = require('./utils/get-url');

module.exports = function(codes, callback) {
  var url = 'http://www.bmfbovespa.com.br/Pregao-Online/ExecutaAcaoAjax.asp';
  codes = arraify(codes);
  getURL(url, {CodigoPapel: codes.join('|')}, function(data) {
    var xml = parseXML(data.toString());

    var stocks = arraify(xml.Papel);
    callback(stocks && stocks.map(function(stock) {
      return {
        code: stock.Codigo,
        name: stock.Nome,
        ibovespa: stock.Ibovespa === '#' ? true : false,
        datetime: stock.Data,
        opening: pf(stock.Abertura),
        min: pf(stock.Minimo),
        max: pf(stock.Maximo),
        mean: pf(stock.Medio),
        last: pf(stock.Ultimo),
        oscillation: pf(stock.Oscilacao),
      };
    }));
  });
}
