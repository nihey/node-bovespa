const axios = require('axios')
const db = require('../lib/db')
const config = require('config')

const columns = [
  'code',
  'price',
  'priceopen',
  'high',
  'low',
  'volume',
  'marketcap',
  'tradetime',
  'datadelay',
  'volumeavg',
  'pe',
  'eps',
  'high52',
  'low52',
  'change',
  'beta',
  'changepct',
  'closeyest',
  'shares',
  'currency'
]

const letters = 'ABCDEFGHIJKLMNOPQRSTUWXYZ'.split('')
const getLetter = (index) => {
  return letters[index]
}

const write = async (data) => {
  return axios.request({
    url: config.SHEET_URL,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(e => console.log(e.response.data))
}

const reset = async () => {
  for (let i = 1; i < 5000; i += 50) {
    const object = {}
    console.log(`Resetting ${i}`)
    for (let j = i; j < (i + 50); j++) {
      letters.forEach(l => {
        object[`${l}${j}`] = ''
      })
    }
    await write(object)
  }
}

const main = async () => {
  console.log('Loading codes...')
  const result = await db.query('SELECT codneg FROM quote WHERE day = NOW()::date - 1;')
  const codes = result[0]

  if (!codes.length) {
    console.log('Nothing to load')
    return process.exit(0)
  }

  await reset()

  const data = {}
  columns.forEach((c, i) => {
    data[`${getLetter(i)}1`] = c
  })
  await write(data)

  for (let i = 2; i < codes.length; i += 50) {
    const object = {}
    console.log(`Updating ${i}`)
    for (let j = i; j < Math.min(i + 50, codes.length); j++) {
      object[`A${j}`] = codes[j].codneg
      letters.slice(1).forEach((l, k) => {
        const coordinate = `$A${j};${getLetter(k + 1)}1`
        object[`${l}${j}`] = `=IF(ISNA(GOOGLEFINANCE(${coordinate}));"";GOOGLEFINANCE(${coordinate}))`
      })
    }
    await write(object)
  }
  process.exit(0)
}

if (require.main === module) {
  main()
}
