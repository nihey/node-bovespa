/* Executes a parseInt with a brazillian formatted number */
module.exports = function(string) {
  string = string.replace(/\s/g, '').replace(/\./g, '').replace(/,/g, '.');
  return parseInt(string);
}
