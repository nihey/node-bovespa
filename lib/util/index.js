const moment = require("moment");
const { Op } = require("sequelize");
const sequelize = require("../db");
const { Quote } = sequelize;

module.exports = {
  get: {
    filled: async (start=moment().startOf("year").format("YYYY-MM-DD")) => {
      const end = moment(start).endOf("year");
      const filled = new Set();
      const quotes = await Quote.findAll({
        where: {
          day: {
            [Op.gte]: moment(start),
            [Op.lte]: moment(end),
          },
        },
      });
      quotes.forEach(q => filled.add(`${moment(q.day).format("YYYY-MM-DD")}-${q.codneg}`))
      return filled;
    },
  },
}
