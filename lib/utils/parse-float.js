/* Executes a parseFloat with a brazillian formatted number */
module.exports = function(string) {
  string = string.replace(/\s/g, '').replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(string);
}
