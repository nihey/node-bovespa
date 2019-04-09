const moment = require('moment')

module.exports = {
  formatters: {
    percentage: (number) => {
      return (number * 100).toFixed(2) + '%'
    }
  },

  get: {
    filled: async (start = moment().startOf('year').format('YYYY-MM-DD')) => {
      const { Op } = require('sequelize')
      const sequelize = require('../db')
      const { Quote } = sequelize

      const end = moment(start).endOf('year')
      const filled = new Set()
      const quotes = await Quote.findAll({
        where: {
          day: {
            [Op.gte]: moment(start),
            [Op.lte]: moment(end)
          }
        }
      })
      quotes.forEach(q => filled.add(`${moment(q.day).format('YYYY-MM-DD')}-${q.codneg}`))
      return filled
    }
  }
}
