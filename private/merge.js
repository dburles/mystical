function merge(...array) {
  return array.reduce(function (_, next) {
    return next;
  }, {});
}

export default merge;
