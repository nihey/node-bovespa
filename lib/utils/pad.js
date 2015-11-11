module.exports = function(number) {
  // Do not use '.repeat' to enlarge support
  for (var i = 0; i < number; ++i) {
    process.stdout.write(' ');
  }
};
