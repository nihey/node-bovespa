const Sequelize = require("sequelize");

const sequelize = new Sequelize("bovespa", process.env.USER, null, {
  host: "/var/run/postgresql",
  dialect: "postgresql",
  logging: false,
});

class Quote extends Sequelize.Model {}
Quote.init({
  day: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  codbdi: Sequelize.STRING,
  codneg: {
    type: Sequelize.STRING,
    allowNull: false,
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

  datven: Sequelize.DATE,
}, {
  tableName: "quote",

  createdAt: "created_at",
  updatedAt: "updated_at",

  indexes: [
    {
      unique: true,
      fields: ["codneg", "day"],
    }
  ],
  sequelize,
})

module.exports = sequelize;
module.exports.Quote = Quote;
