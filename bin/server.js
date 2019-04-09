#!/usr/bin/env node

const moment = require('moment')
const sequelize = require('../lib/db')
const { Quote } = sequelize

module.exports = async (fastify, options) => {
  fastify.get('/api/quote/:code/:date', async (request, reply) => {
    const quote = await Quote.findOne({
      where: {
        codneg: request.params.code.toUpperCase(),
        day: moment(request.params.date)
      }
    })

    if (!quote) {
      reply.status(404)
      return {
        error: 'NOT_FOUND'
      }
    }

    return quote.dataValues
  })
}
