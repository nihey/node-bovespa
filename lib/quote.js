var parseXML = require('pixl-xml').parse,
    pi = require('./utils/parse-int'),
    pf = require('./utils/parse-float'),
    getURL = require('./utils/get-url');

module.exports = function(code, callback) {
  var url = 'http://www.bmfbovespa.com.br/cotacoes2000/formCotacoesMobile.asp';
  getURL(url, {codsocemi: code}, function(data) {
    var xml = parseXML(data.toString());
    xml = xml && (xml.PAPEL || null);
    callback(xml && {
      description: xml.DESCRICAO,
      code: xml.CODIGO,
      ibovespa: xml.IBOVESPA == 'S' ? true : false,
      delay: pi(xml.DELAY),
      datetime: xml.DATA + ' ' + xml.HORA,
      oscillation: pf(xml.OSCILACAO),
      volume: pi(xml.QUANT_NEG),
      type: xml.MERCADO,
    });
  });
}
