const axios = require('axios')
const moment = require('moment')
const config = require('config')

module.exports = function (api = config.api) {
  return async function (code, date) {
    code = (code || '').toUpperCase()
    date = date || moment().format('YYYY-MM-DD')
    const data = axios.get(`${api}/api/quote/${code}/${date}`).then(r => r.data);
    ['preabe', 'premin', 'premax', 'premed', 'preult', 'preofc', 'preofv', 'preexe'].forEach(attr => {
      data[attr] = parseFloat(data[attr])
    })
    return data
  }
}
