# Node Bovespa

Access Bovespa's Web Service API in a JavaScriptic way.

[![Dependency
Status](https://david-dm.org/nihey/node-bovespa.png)](https://david-dm.org/nihey/node-bovespa)

# Why

Bovespa's API may not be the best one to work with. Consuming data in a
querystring-like and XML formats is annoying, so why not consume it in
JSON/Javascript Objects?

# Installing
```
$ npm install bovespa --save
```

# Command Line
```
$ bovespa

Get data from Bovespa's API in a JavaScriptic way

  Usage
    bovespa <symbol> [options]

  Options:
    -q, --quote      quote status (default option)
    -v, --volume     traded volume data
    -t, --trading    daily trading history
    -s, --stats      bovespa daily status

  Examples:

    bovespa ABEV3
    bovespa ABEV3 EDGA11B
    bovespa EDGA11B -t
    bovespa -s
```

# Using

Daily trading history of a company/FF ([original](http://www.bmfbovespa.com.br/Pregao-Online/ExecutaAcaoCarregarDadosPapeis.asp?CodDado=EDGA11B))
```
require('bovespa').history('EDGA11B', function(history) {
  console.log(history);
});

// stdout:
//
//  {
//    date: '2015/Ago/21',
//    traded: [{
//        time: '10:00:00',
//        value: '71.43',
//        oscillation: '-0.01'
//      }, {
//        time: '10:03:36',
//        value: '71.43',
//        oscillation: '-0.01'
//      },
//      ... a lot of operations ...
//      {
//        time: '16:50:59',
//        value: '72.14',
//        oscillation: '0.97'
//      }, {
//        time: '16:52:06',
//        value: '72.14',
//        oscillation: '0.97'
//      }
//    ]
//  }
```

Single stock quote API ([original](http://www.bmfbovespa.com.br/cotacoes2000/formCotacoesMobile.asp?codsocemi=EDGA11B))
```
require('bovespa').quote('EDGA11B', function(quote) {
  console.log(quote);
});

// stdout:
//
// {
//   description: 'FII GALERIA    CI      MB',
//   code: 'EDGA11B',
//   ibovespa: false,
//   delay: 15,
//   datetime: '21/08/2015 16:52:19',
//   oscillation: 0.78,
//   volume: 295,
//   type: 'Vista'
// }
```

Multiple stock quote API ([original](http://www.bmfbovespa.com.br/Pregao-Online/ExecutaAcaoAjax.asp?CodigoPapel=EDGA11B|ABEV3|PETR4))
```
require('bovespa').quotes(['EDGA11B', 'ABEV3'], function(quotes) {
  console.log(quotes);
});

// stdout:
//
//  [{
//    code: 'EDGA11B',
//    name: 'FII GALERIA CI      MB',
//    ibovespa: false,
//    datetime: '21/08/2015 16:52:19',
//    opening: 71.43,
//    min: 71.02,
//    max: 72.5,
//    mean: 71.54,
//    last: 72,
//    oscillation: 0.78
//  }, {
//    code: 'ABEV3',
//    name: 'AMBEV S/A ON',
//    ibovespa: true,
//    datetime: '21/08/2015 17:59:55',
//    opening: 18.32,
//    min: 18,
//    max: 18.43,
//    mean: 18.18,
//    last: 18.05,
//    oscillation: -2
//  }]
```

# License

This code is released under
[CC0](http://creativecommons.org/publicdomain/zero/1.0/) (Public Domain)
