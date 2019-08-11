const config = require('config')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  config.db.database,
  config.db.user || process.env.USER, config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: false
  }
)

class Quote extends Sequelize.Model {}
Quote.init({
  day: {
    type: Sequelize.DATE,
    allowNull: false
  },
  codbdi: Sequelize.STRING,
  codneg: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tpmerc: Sequelize.STRING,
  nomres: Sequelize.STRING,
  especi: Sequelize.STRING,
  prazot: Sequelize.STRING,
  modref: Sequelize.STRING,

  preabe: Sequelize.DECIMAL,
  premin: Sequelize.DECIMAL,
  premax: Sequelize.DECIMAL,
  premed: Sequelize.DECIMAL,
  preult: Sequelize.DECIMAL,
  preofc: Sequelize.DECIMAL,
  preofv: Sequelize.DECIMAL,
  preexe: Sequelize.DECIMAL,

  totneg: Sequelize.INTEGER,
  quatot: Sequelize.INTEGER,
  voltot: Sequelize.INTEGER,

  indopc: Sequelize.STRING,
  fatcot: Sequelize.STRING,
  ptoexe: Sequelize.STRING,
  codisi: Sequelize.STRING,
  dismes: Sequelize.STRING,

  datven: Sequelize.DATE
}, {
  tableName: 'quote',

  createdAt: 'created_at',
  updatedAt: 'updated_at',

  indexes: [
    {
      unique: true,
      fields: ['codneg', 'day']
    }
  ],
  sequelize
})

class Realtime extends Sequelize.Model {}
Realtime.init({
  day: {
    type: 'DATE',
    allowNull: false
  },
  code: Sequelize.STRING,
  currency: Sequelize.STRING,

  price: Sequelize.DECIMAL,
  priceopen: Sequelize.DECIMAL,
  high: Sequelize.DECIMAL,
  low: Sequelize.DECIMAL,
  marketcap: Sequelize.DECIMAL,
  datadelay: Sequelize.DECIMAL,
  volumeavg: Sequelize.DECIMAL,
  pe: Sequelize.DECIMAL,
  eps: Sequelize.DECIMAL,
  high52: Sequelize.DECIMAL,
  low52: Sequelize.DECIMAL,
  change: Sequelize.DECIMAL,
  beta: Sequelize.DECIMAL,
  changepct: Sequelize.DECIMAL,
  closeyest: Sequelize.DECIMAL,

  tradetime: 'TIMESTAMP',

  volume: Sequelize.BIGINT,
  shares: Sequelize.BIGINT
}, {
  tableName: 'realtime',

  createdAt: 'created_at',
  updatedAt: 'updated_at',

  indexes: [
    {
      unique: true,
      fields: ['code', 'day']
    }
  ],
  sequelize
})

module.exports = sequelize
module.exports.Quote = Quote
module.exports.Realtime = Realtime
