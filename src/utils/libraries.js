'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isRNGH2 = exports.isBelowRN65 = void 0;
const react_native_1 = require('react-native');
/**
 * Before React Native 65, event listeners were taking an `addEventListener` and a `removeEventListener` function.
 * After React Native 65, the `addEventListener` is a subscription that return a remove callback to unsubscribe to the listener.
 * We want to detect which version of React Native we are using to support both way to handle listeners.
 */
exports.isBelowRN65 = react_native_1.Platform.constants?.reactNativeVersion?.minor < 65;
/**
 * Since RNGH version 2, the `minDist` property is not compatible with `activeOffsetX` and `activeOffsetY`.
 * We check which version of RNGH we are using to support both way to handle `minDist` property.
 */
exports.isRNGH2 = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require('react-native-gesture-handler/package.json');
  return parseInt(version, 10) >= 2;
};
