#!/usr/bin/env node

const moment = require('moment')
const sequelize = require('../lib/db')
const { Quote, Realtime } = sequelize

module.exports = async (fastify, options) => {
  const getMaxDate = async () => {
    const response = await sequelize.query('SELECT MAX(day) FROM realtime;')
    if (!response[0].length) {
      return null
    }

    return response[0][0].max
  }

  const realtimeMap = (d) => {
    const returned = {}
    const attrs = [
      'day',
      'code',
      'currency',
      'price',
      'priceopen',
      'high',
      'low',
      'shares',
      'datadelay',
      'volumeavg',
      'volume',
      'closeyest',
      'tradetime'
    ]
    attrs.forEach(attr => {
      returned[attr] = d[attr]
    })

    return returned
  }
  const realtimeFilter = (d) => d.price

  fastify.get('/api/realtime', async (request, reply) => {
    const data = await Realtime.findAll({
      where: {
        day: moment(await getMaxDate()).toDate()
      }
    })

    return data.map(realtimeMap).filter(realtimeFilter)
  })

  fastify.get('/api/realtime/:code', async (request, reply) => {
    const data = await Realtime.findOne({
      where: {
        code: request.params.code.toUpperCase(),
        day: moment(await getMaxDate()).toDate()
      }
    })

    if (!data) {
      reply.status(404)
      return {
        error: 'NOT_FOUND'
      }
    }

    return realtimeMap(data.dataValues)
  })

  fastify.get('/api/quote/:code/:date', async (request, reply) => {
    const quote = await Quote.findOne({
      where: {
        codneg: request.params.code.toUpperCase(),
        day: moment(request.params.date).toDate()
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
