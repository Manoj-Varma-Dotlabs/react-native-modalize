'use strict';
exports.__esModule = true;
exports.useDimensions = void 0;
var React = require('react');
var react_native_1 = require('react-native');
var libraries_1 = require('./libraries');
exports.useDimensions = function () {
  var _a = React.useState(react_native_1.Dimensions.get('window')),
    dimensions = _a[0],
    setDimensions = _a[1];
  var onChange = function (_a) {
    var window = _a.window;
    setDimensions(window);
  };
  React.useEffect(function () {
    var dimensionChangeListener = null;
    if (libraries_1.isBelowRN65) {
      react_native_1.Dimensions.addEventListener('change', onChange);
    } else {
      dimensionChangeListener = react_native_1.Dimensions.addEventListener('change', onChange);
    }
    return function () {
      if (libraries_1.isBelowRN65) {
        react_native_1.Dimensions.removeEventListener('change', onChange);
      } else {
        dimensionChangeListener === null || dimensionChangeListener === void 0
          ? void 0
          : dimensionChangeListener.remove();
      }
    };
  }, []);
  return dimensions;
};
