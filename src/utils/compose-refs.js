'use strict';
exports.__esModule = true;
exports.composeRefs = void 0;
var composedRefCache = new WeakMap();
exports.composeRefs = function (ref1, ref2) {
  if (ref1 && ref2) {
    var ref1Cache = composedRefCache.get(ref1) || new WeakMap();
    composedRefCache.set(ref1, ref1Cache);
    var composedRef =
      ref1Cache.get(ref2) ||
      function (instance) {
        updateRef(ref1, instance);
        updateRef(ref2, instance);
      };
    ref1Cache.set(ref2, composedRef);
    return composedRef;
  }
  return ref1;
};
var updateRef = function (ref, instance) {
  if (typeof ref === 'function') {
    ref(instance);
  } else {
    ref.current = instance;
  }
};
