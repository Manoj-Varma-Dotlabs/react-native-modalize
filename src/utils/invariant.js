'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
exports.__esModule = true;
exports.invariant = void 0;
var genericMessage = 'Invariant Violation "react-native-modalize"';
var _a = Object.setPrototypeOf,
  setPrototypeOf =
    _a === void 0
      ? function (obj, proto) {
          obj.__proto__ = proto;
          return obj;
        }
      : _a;
var InvariantError = /** @class */ (function (_super) {
  __extends(InvariantError, _super);
  function InvariantError(message) {
    if (message === void 0) {
      message = genericMessage;
    }
    var _this = _super.call(this, '' + message) || this;
    _this.framesToPop = 1;
    _this.name = genericMessage;
    setPrototypeOf(_this, InvariantError.prototype);
    return _this;
  }
  return InvariantError;
})(Error);
exports.invariant = function (condition, message) {
  if (condition) {
    throw new InvariantError(message);
  }
};
