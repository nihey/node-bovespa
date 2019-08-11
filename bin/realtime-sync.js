const config = require('config')
const axios = require('axios')
const moment = require('moment')
const db = require('../lib/db')
const { Realtime } = require('../lib/db')

const main = async () => {
  await db.sync()

  console.log('Requesting data...')
  const response = await axios.request({
    url: config.SHEET_URL,
    method: 'GET'
  })
  console.log('parsing...')
  const { data } = response
  const quotes = data.map(d => {
    Object.entries(d).forEach(([k, v]) => {
      if (k === 'tradetime') {
        d[k] = moment(v, 'DD/MM/YYYY HH:mm:ss').toDate() || null
      } else if (['currency', 'code'].find(attr => k === attr)) {
        d[k] = v
      } else {
        d[k] = parseFloat(v.replace(',', '.')) || null
      }
    })

    return d
  })

  for (const quote of quotes) {
    if (!quote.tradetime) {
      continue
    }

    console.log('Inserting', quote.code)
    Realtime.upsert({
      ...quote,
      day: quote.tradetime
    })
  }
  console.log('Syncing...')
  await db.sync()

  process.exit(0)
}

if (require.main === module) {
  main()
}
