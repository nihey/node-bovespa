var Stream = require('stream').Transform,
    param = require('jquery-param');

module.exports = function(url, params, callback) {
  var http = require(url.split('://')[0]);
  url = url + '?' + param(params);
  http.request(url, function(response) {
    var data = new Stream();

    response.on('data', function(chunk) {
      data.push(chunk);
    });

    response.on('end', function() {
      callback(data.read());
    });
  }).end();
}
