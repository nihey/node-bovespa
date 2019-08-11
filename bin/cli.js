#!/usr/bin/env node

const meow = require('meow')
const moment = require('moment')
const bovespa = require('../lib/index')
const { formatters } = require('../lib/util')
const chalk = require('chalk')
const { bold, green, red } = chalk

const cli = meow(`
  Usage:
    $ bovespa <codes ...> [Options]

    Extracts data from bovespa and displays it on the terminal

    Options
      --date, -d <YYYY-MM-DD or int> [Default: Today] Which date to extract the data from or days relative to today
      --api, -a <API URL> [Default 'https://bovespa.nihey.org']

    Examples:
      $ bovespa ABEV3
      $ bovespa ABEV3 --date 2019-04-01
      $ bovespa ABEV3 PETR4 BIDI4 --date 2019-04-01

      # Get data from yesterday
      $ bovespa ABEV3 PETR4 BIDI4 --date -1
`, {
  flags: {
    date: {
      type: 'string',
      alias: 'd',
      default: moment().format('YYYY-MM-DD')
    },
    api: {
      type: 'string',
      alias: 'a',
      default: process.env.BOVESPA_API || 'https://bovespa.nihey.org'
    }
  }
})

async function main () {
  const codes = cli.input
  let date = cli.flags.date
  const api = cli.flags.api

  if (codes.length === 0) {
    cli.showHelp()
  }

  for (const code of codes) {
    const getQuote = bovespa(api)
    let data
    try {
      const intDate = parseInt(date, 10)
      if (intDate <= 0) {
        date = moment().add(intDate, 'days').format('YYYY-MM-DD')
      }

      if (moment(date).isSame(moment(), 'day')) {
        data = await getQuote.realtime(code)

        if (!moment(data.day).isSame(date, 'day')) {
          const error = new Error()
          error.response = { status: 404 }
          throw error
        }

        data = {
          codneg: data.code,
          preult: data.price,
          preabe: data.priceopen,
          premed: null,
          premax: data.high,
          premin: data.low
        }
      } else {
        data = await getQuote(code, date)
      }
    } catch (e) {
      if (e.response.status === 404) {
        console.log(chalk`CODE: ${red(bold(code))} @ ${red(bold(date))}`)
        console.log(red(bold('NOT FOUND')))
        console.log('')
        continue
      }
      throw e
    }

    let color = green
    if (data.preult < data.preabe) {
      color = red
    }

    console.log(chalk`CODE: ${color(bold(data.codneg))} @ ${bold(date)}`)
    console.log(chalk`Variation: ${color(formatters.percentage((data.preult - data.preabe) / data.preult))}`)
    console.log(chalk`Opening: ${color(data.preabe)}`)
    console.log(chalk`Closing: ${color(data.preult)}`)
    if (data.premed) {
      console.log(chalk`Average: ${color(data.premed)}`)
    }
    console.log(chalk`Max: ${color(data.premax)}`)
    console.log(chalk`Min: ${color(data.premin)}`)
    console.log('')
  }
}

if (require.main === module) {
  main()
}
