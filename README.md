# Node Bovespa

## Warning: This module is currently partially active, due to bovespa's original API disappearance. But it will be brought back to you once we can work around that [issue](https://github.com/nihey/node-bovespa/issues/5).

Access bovespa/B3 data in many ways:

- API
- JavaScript module

Also:

- Scrap and organize data from bovespa's historic time series

[![Dependency
Status](https://david-dm.org/nihey/node-bovespa.png)](https://david-dm.org/nihey/node-bovespa)
[![Build Status](https://travis-ci.org/nihey/node-bovespa.svg?branch=master)](https://travis-ci.org/nihey/node-bovespa)

# Why

Free B3 data extraction is poor, the few places that have it have high costs
for starters.

This project was done so that developers like you and me can have access to B3
data in a easier way and develop nice things on top of it.

# Installing
```bash
$ npm install bovespa --save
```

For CLI usage it would be better to do:

```bash
$ npm install bovespa -g
```

# Usage

## JavaScript

We use the promise API to fetch all sorts of data:

```javascript
// Using the default API (attention for the final function call):
const bovespa = require("bovespa")();

// Querying data:
bovespa("ABEV3", "2018-04-23").then(data => {
  // Manipulate your data here
});

// What is received:
bovespa("ABEV3", "2018-04-23").then(console.log);
// Outputs raw bovespa data:
//
// {
//   id: 4851343,
//   day: '2018-04-23',
//   codbdi: '02',
//   codneg: 'ABEV3',
//   tpmerc: '010',
//   nomres: 'AMBEV S/A',
//   especi: 'ON',
//   prazot: '',
//   modref: 'R$',
//   preabe: '23.31',
//   premin: '23.23',
//   premax: '23.55',
//   premed: '23.40',
//   preult: '23.45',
//   preofc: '23.44',
//   preofv: '23.45',
//   preexe: '0.00',
//   totneg: '21813',
//   quatot: '8104000',
//   voltot: '18967719600',
//   indopc: '0',
//   fatcot: '0000001',
//   ptoexe: '0000000000000',
//   codisi: 'BRABEVACNOR1',
//   dismes: '119',
//   datven: '9999-12-31',
//   created_at: '2019-04-01T12:25:13.439Z',
//   updated_at: '2019-04-01T12:25:13.439Z'
// }
```

You can use a different server to fetch data from your own API too:
```javascript
const bovespa = require("bovespa")("https://<your own api here>");

bovespa("ABEV3", "2018-04-23").then(data => {
  // Manipulate your data here
});
```

## CLI

Command line help should give you a good guide on how to use the project

```bash
$ bovespa --help

  Bovespa data extractor, server, and command line interface

  Usage:
    $ bovespa <codes ...> [Options]

    Extracts data from bovespa and displays it on the terminal

    Options
      --date, -d <YYYY-MM-DD> [Default: Today] Which date to extract the data from
      --api, -a <API URL> [Default 'https://bovespa.nihey.org']

    Examples:
      $ bovespa ABEV3
      $ bovespa ABEV3 --date 2019-04-01
      $ bovespa ABEV3 PETR4 BIDI4 --date 2019-04-01
```

You can query historic time series by using this command:

```bash
$ bovespa ABEV3 PETR4 -d 2019-04-01

# Output:
#
# > CODE: ABEV3 @ 2019-04-01
# > Variation: -0.30%
# > Opening: 16.87
# > Closing: 16.82
# > Average: 16.85
# > Max: 17.00
# > Min: 16.74
# >
# > CODE: PETR4 @ 2019-04-01
# > Variation: -1.43%
# > Opening: 28.40
# > Closing: 28.00
# > Average: 28.11
# > Max: 28.42
# > Min: 27.87
```

# License

This code is released under
[CC0](http://creativecommons.org/publicdomain/zero/1.0/) (Public Domain)
