module.exports = function(anything) {
  if (Array.isArray(anything)) {
    return anything;
  }
  return anything && [anything];
};
