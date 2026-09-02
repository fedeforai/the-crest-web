(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CrestTrailGeometry = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function progressIndex(ranks) {
    var i;
    for (i = 0; i < ranks.length; i++) {
      if (ranks[i].state === 'current') return ranks[i].id;
    }
    return 0;
  }

  function lineFromCenters(centers, index) {
    var left = centers[0];
    var right = centers[index];
    return { left: left, width: right - left };
  }

  function beadOpacity(state) {
    return state === 'locked' ? 0.7 : 1;
  }

  return {
    progressIndex: progressIndex,
    lineFromCenters: lineFromCenters,
    beadOpacity: beadOpacity
  };
});
