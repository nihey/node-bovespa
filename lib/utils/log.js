var chalk = require('chalk');

module.exports = function(text, style) {
  style = style || 'white';
  process.stdout.write(chalk[style](text));
};
