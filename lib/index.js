const axios = require('axios')
const moment = require('moment')

module.exports = function (api = process.env.BOVESPA_API || 'https://bovespa.nihey.org') {
  const func = async function (code, date) {
    code = (code || '').toUpperCase()
    date = date || moment().format('YYYY-MM-DD')
    const data = axios.get(`${api}/api/quote/${code}/${date}`).then(r => r.data);
    ['preabe', 'premin', 'premax', 'premed', 'preult', 'preofc', 'preofv', 'preexe'].forEach(attr => {
      data[attr] = parseFloat(data[attr])
    })
    return data
  }

  func.realtime = async function (code) {
    code = (code || '').toUpperCase()
    const data = axios.get(`${api}/api/realtime/${code}`).then(r => r.data)
    return data
  }

  return func
}
