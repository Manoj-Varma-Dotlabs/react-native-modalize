'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
exports.Modalize = void 0;
/**
 * esModuleInterop: true looks to work everywhere except
 * on snack.expo for some reason. Will revisit this later.
 */
var React = require('react');
var react_native_1 = require('react-native');
var react_native_gesture_handler_1 = require('react-native-gesture-handler');
var use_dimensions_1 = require('./utils/use-dimensions');
var get_spring_config_1 = require('./utils/get-spring-config');
var devices_1 = require('./utils/devices');
var libraries_1 = require('./utils/libraries');
var invariant_1 = require('./utils/invariant');
var compose_refs_1 = require('./utils/compose-refs');
var styles_1 = require('./styles');
var AnimatedKeyboardAvoidingView = react_native_1.Animated.createAnimatedComponent(
  react_native_1.KeyboardAvoidingView,
);
/**
 * When scrolling, it happens than beginScrollYValue is not always equal to 0 (top of the ScrollView).
 * Since we use this to trigger the swipe down gesture animation, we allow a small threshold to
 * not dismiss Modalize when we are using the ScrollView and we don't want to dismiss.
 */
var SCROLL_THRESHOLD = -4;
var USE_NATIVE_DRIVER = true;
var ACTIVATED = 20;
var PAN_DURATION = 150;
var ModalizeBase = function (_a, ref) {
  var // Refs
    contentRef = _a.contentRef,
    // Renderers
    children = _a.children,
    scrollViewProps = _a.scrollViewProps,
    flatListProps = _a.flatListProps,
    sectionListProps = _a.sectionListProps,
    customRenderer = _a.customRenderer,
    // Styles
    rootStyle = _a.rootStyle,
    modalStyle = _a.modalStyle,
    handleStyle = _a.handleStyle,
    overlayStyle = _a.overlayStyle,
    childrenStyle = _a.childrenStyle,
    // Layout
    snapPoint = _a.snapPoint,
    modalHeight = _a.modalHeight,
    _b = _a.modalTopOffset,
    modalTopOffset =
      _b === void 0
        ? react_native_1.Platform.select({
            ios: 0,
            android: react_native_1.StatusBar.currentHeight || 0,
            default: 0,
          })
        : _b,
    alwaysOpen = _a.alwaysOpen,
    _c = _a.adjustToContentHeight,
    adjustToContentHeight = _c === void 0 ? false : _c,
    // Options
    _d = _a.handlePosition,
    // Options
    handlePosition = _d === void 0 ? 'outside' : _d,
    _e = _a.disableScrollIfPossible,
    disableScrollIfPossible = _e === void 0 ? true : _e,
    _f = _a.avoidKeyboardLikeIOS,
    avoidKeyboardLikeIOS =
      _f === void 0
        ? react_native_1.Platform.select({
            ios: true,
            android: false,
            default: true,
          })
        : _f,
    _g = _a.keyboardAvoidingBehavior,
    keyboardAvoidingBehavior = _g === void 0 ? 'padding' : _g,
    keyboardAvoidingOffset = _a.keyboardAvoidingOffset,
    _h = _a.panGestureEnabled,
    panGestureEnabled = _h === void 0 ? true : _h,
    _j = _a.panGestureComponentEnabled,
    panGestureComponentEnabled = _j === void 0 ? false : _j,
    _k = _a.tapGestureEnabled,
    tapGestureEnabled = _k === void 0 ? true : _k,
    _l = _a.closeOnOverlayTap,
    closeOnOverlayTap = _l === void 0 ? true : _l,
    _m = _a.closeSnapPointStraightEnabled,
    closeSnapPointStraightEnabled = _m === void 0 ? true : _m,
    // Animations
    _o = _a.openAnimationConfig,
    // Animations
    openAnimationConfig =
      _o === void 0
        ? {
            timing: { duration: 240, easing: react_native_1.Easing.ease },
            spring: { speed: 14, bounciness: 4 },
          }
        : _o,
    _p = _a.closeAnimationConfig,
    closeAnimationConfig =
      _p === void 0
        ? {
            timing: { duration: 240, easing: react_native_1.Easing.ease },
          }
        : _p,
    _q = _a.dragToss,
    dragToss = _q === void 0 ? 0.18 : _q,
    _r = _a.threshold,
    threshold = _r === void 0 ? 120 : _r,
    _s = _a.velocity,
    velocity = _s === void 0 ? 2800 : _s,
    panGestureAnimatedValue = _a.panGestureAnimatedValue,
    _t = _a.useNativeDriver,
    useNativeDriver = _t === void 0 ? true : _t,
    // Elements visibilities
    _u = _a.withReactModal,
    // Elements visibilities
    withReactModal = _u === void 0 ? false : _u,
    reactModalProps = _a.reactModalProps,
    _v = _a.withHandle,
    withHandle = _v === void 0 ? true : _v,
    _w = _a.withOverlay,
    withOverlay = _w === void 0 ? true : _w,
    // Additional components
    HeaderComponent = _a.HeaderComponent,
    FooterComponent = _a.FooterComponent,
    FloatingComponent = _a.FloatingComponent,
    // Callbacks
    onOpen = _a.onOpen,
    onOpened = _a.onOpened,
    onClose = _a.onClose,
    onClosed = _a.onClosed,
    onBackButtonPress = _a.onBackButtonPress,
    onPositionChange = _a.onPositionChange,
    onOverlayPress = _a.onOverlayPress,
    onLayout = _a.onLayout;
  var screenHeight = use_dimensions_1.useDimensions().height;
  var isHandleOutside = handlePosition === 'outside';
  var handleHeight = withHandle ? 20 : isHandleOutside ? 35 : 20;
  var fullHeight = screenHeight - modalTopOffset;
  var computedHeight = fullHeight - handleHeight - (devices_1.isIphoneX ? 34 : 0);
  var endHeight = modalHeight || computedHeight;
  var adjustValue = adjustToContentHeight ? undefined : endHeight;
  var snaps = snapPoint ? [0, endHeight - snapPoint, endHeight] : [0, endHeight];
  var _x = React.useState(adjustValue),
    modalHeightValue = _x[0],
    setModalHeightValue = _x[1];
  var _y = React.useState(snapPoint ? endHeight - snapPoint : 0),
    lastSnap = _y[0],
    setLastSnap = _y[1];
  var _z = React.useState(false),
    isVisible = _z[0],
    setIsVisible = _z[1];
  var _0 = React.useState(true),
    showContent = _0[0],
    setShowContent = _0[1];
  var _1 = React.useState(true),
    enableBounces = _1[0],
    setEnableBounces = _1[1];
  var _2 = React.useState(false),
    keyboardToggle = _2[0],
    setKeyboardToggle = _2[1];
  var _3 = React.useState(0),
    keyboardHeight = _3[0],
    setKeyboardHeight = _3[1];
  var _4 = React.useState(alwaysOpen || snapPoint ? true : undefined),
    disableScroll = _4[0],
    setDisableScroll = _4[1];
  var _5 = React.useState(0),
    beginScrollYValue = _5[0],
    setBeginScrollYValue = _5[1];
  var _6 = React.useState('initial'),
    modalPosition = _6[0],
    setModalPosition = _6[1];
  var _7 = React.useState(false),
    cancelClose = _7[0],
    setCancelClose = _7[1];
  var _8 = React.useState(new Map()),
    layouts = _8[0],
    setLayouts = _8[1];
  var cancelTranslateY = React.useRef(new react_native_1.Animated.Value(1)).current; // 1 by default to have the translateY animation running
  var componentTranslateY = React.useRef(new react_native_1.Animated.Value(0)).current;
  var overlay = React.useRef(new react_native_1.Animated.Value(0)).current;
  var beginScrollY = React.useRef(new react_native_1.Animated.Value(0)).current;
  var dragY = React.useRef(new react_native_1.Animated.Value(0)).current;
  var translateY = React.useRef(new react_native_1.Animated.Value(screenHeight)).current;
  var reverseBeginScrollY = React.useRef(
    react_native_1.Animated.multiply(new react_native_1.Animated.Value(-1), beginScrollY),
  ).current;
  var tapGestureModalizeRef = React.useRef(null);
  var panGestureChildrenRef = React.useRef(null);
  var nativeViewChildrenRef = React.useRef(null);
  var contentViewRef = React.useRef(null);
  var tapGestureOverlayRef = React.useRef(null);
  var backButtonListenerRef = React.useRef(null);
  // We diff and get the negative value only. It sometimes go above 0
  // (e.g. 1.5) and creates the flickering on Modalize for a ms
  var diffClamp = react_native_1.Animated.diffClamp(reverseBeginScrollY, -screenHeight, 0);
  var componentDragEnabled = componentTranslateY._value === 1;
  // When we have a scrolling happening in the ScrollView, we don't want to translate
  // the modal down. We either multiply by 0 to cancel the animation, or 1 to proceed.
  var dragValue = react_native_1.Animated.add(
    react_native_1.Animated.multiply(dragY, componentDragEnabled ? 1 : cancelTranslateY),
    diffClamp,
  );
  var value = react_native_1.Animated.add(
    react_native_1.Animated.multiply(translateY, componentDragEnabled ? 1 : cancelTranslateY),
    dragValue,
  );
  var willCloseModalize = false;
  var handleBackPress = function () {
    if (alwaysOpen) {
      return false;
    }
    if (onBackButtonPress) {
      return onBackButtonPress();
    } else {
      handleClose();
    }
    return true;
  };
  var handleKeyboardShow = function (event) {
    var height = event.endCoordinates.height;
    setKeyboardToggle(true);
    setKeyboardHeight(height);
  };
  var handleKeyboardHide = function () {
    setKeyboardToggle(false);
    setKeyboardHeight(0);
  };
  var handleAnimateOpen = function (alwaysOpenValue, dest) {
    if (dest === void 0) {
      dest = 'default';
    }
    var timing = openAnimationConfig.timing,
      spring = openAnimationConfig.spring;
    backButtonListenerRef.current = react_native_1.BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    var toValue = 0;
    var toPanValue = 0;
    var newPosition;
    if (dest === 'top') {
      toValue = 0;
    } else if (alwaysOpenValue) {
      toValue = (modalHeightValue || 0) - alwaysOpenValue;
    } else if (snapPoint) {
      toValue = (modalHeightValue || 0) - snapPoint;
    }
    if (panGestureAnimatedValue && (alwaysOpenValue || snapPoint)) {
      toPanValue = 0;
    } else if (
      panGestureAnimatedValue &&
      !alwaysOpenValue &&
      (dest === 'top' || dest === 'default')
    ) {
      toPanValue = 1;
    }
    // Modified by Manoj Varma for initial Open Value to 1
    if (panGestureAnimatedValue && alwaysOpenValue && (dest === 'top' || dest === 'default')) {
      toPanValue = 1;
    }
    // END
    setIsVisible(true);
    setShowContent(true);
    if ((alwaysOpenValue && dest !== 'top') || (snapPoint && dest === 'default')) {
      newPosition = 'initial';
    } else {
      newPosition = 'top';
    }
    react_native_1.Animated.parallel([
      react_native_1.Animated.timing(overlay, {
        toValue: alwaysOpenValue && dest === 'default' ? 0 : 1,
        duration: timing.duration,
        easing: react_native_1.Easing.ease,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      panGestureAnimatedValue
        ? react_native_1.Animated.timing(panGestureAnimatedValue, {
            toValue: toPanValue,
            duration: PAN_DURATION,
            easing: react_native_1.Easing.ease,
            useNativeDriver: useNativeDriver,
          })
        : react_native_1.Animated.delay(0),
      spring
        ? react_native_1.Animated.spring(
            translateY,
            __assign(__assign({}, get_spring_config_1.getSpringConfig(spring)), {
              toValue: toValue,
              useNativeDriver: USE_NATIVE_DRIVER,
            }),
          )
        : react_native_1.Animated.timing(translateY, {
            toValue: toValue,
            duration: timing.duration,
            easing: timing.easing,
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
    ]).start(function () {
      if (onOpened) {
        onOpened();
      }
      setModalPosition(newPosition);
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
    });
  };
  var handleAnimateClose = function (dest, callback) {
    var _a;
    if (dest === void 0) {
      dest = 'default';
    }
    var timing = closeAnimationConfig.timing,
      spring = closeAnimationConfig.spring;
    var lastSnapValue = snapPoint ? snaps[1] : 80;
    var toInitialAlwaysOpen = dest === 'alwaysOpen' && Boolean(alwaysOpen);
    var toValue =
      toInitialAlwaysOpen && alwaysOpen ? (modalHeightValue || 0) - alwaysOpen : screenHeight;
    (_a = backButtonListenerRef.current) === null || _a === void 0 ? void 0 : _a.remove();
    cancelTranslateY.setValue(1);
    setBeginScrollYValue(0);
    beginScrollY.setValue(0);
    react_native_1.Animated.parallel([
      react_native_1.Animated.timing(overlay, {
        toValue: 0,
        duration: timing.duration,
        easing: react_native_1.Easing.ease,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      panGestureAnimatedValue
        ? react_native_1.Animated.timing(panGestureAnimatedValue, {
            toValue: 0,
            duration: PAN_DURATION,
            easing: react_native_1.Easing.ease,
            useNativeDriver: useNativeDriver,
          })
        : react_native_1.Animated.delay(0),
      spring
        ? react_native_1.Animated.spring(
            translateY,
            __assign(__assign({}, get_spring_config_1.getSpringConfig(spring)), {
              toValue: toValue,
              useNativeDriver: USE_NATIVE_DRIVER,
            }),
          )
        : react_native_1.Animated.timing(translateY, {
            duration: timing.duration,
            easing: react_native_1.Easing.out(react_native_1.Easing.ease),
            toValue: toValue,
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
    ]).start(function () {
      if (onClosed) {
        onClosed();
      }
      if (callback) {
        callback();
      }
      if (alwaysOpen && dest === 'alwaysOpen' && onPositionChange) {
        onPositionChange('initial');
      }
      if (alwaysOpen && dest === 'alwaysOpen') {
        setModalPosition('initial');
      }
      setShowContent(toInitialAlwaysOpen);
      translateY.setValue(toValue);
      dragY.setValue(0);
      willCloseModalize = false;
      setLastSnap(lastSnapValue);
      setIsVisible(toInitialAlwaysOpen);
    });
  };
  var handleModalizeContentLayout = function (_a) {
    var layout = _a.nativeEvent.layout;
    var value = Math.min(
      layout.height + (!adjustToContentHeight || keyboardHeight ? layout.y : 0),
      endHeight -
        react_native_1.Platform.select({
          ios: 0,
          android: keyboardHeight,
          default: 0,
        }),
    );
    setModalHeightValue(value);
  };
  var handleBaseLayout = function (component, height) {
    setLayouts(new Map(layouts.set(component, height)));
    var max = Array.from(layouts).reduce(function (acc, cur) {
      return acc + (cur === null || cur === void 0 ? void 0 : cur[1]);
    }, 0);
    var maxFixed = +max.toFixed(3);
    var endHeightFixed = +endHeight.toFixed(3);
    var shorterHeight = maxFixed < endHeightFixed;
    setDisableScroll(shorterHeight && disableScrollIfPossible);
  };
  var handleContentLayout = function (_a) {
    var nativeEvent = _a.nativeEvent;
    if (onLayout) {
      onLayout(nativeEvent);
    }
    if (alwaysOpen && adjustToContentHeight) {
      var height = nativeEvent.layout.height;
      return setModalHeightValue(height);
    }
    // We don't want to disable the scroll if we are not using adjustToContentHeight props
    if (!adjustToContentHeight) {
      return;
    }
    handleBaseLayout('content', nativeEvent.layout.height);
  };
  var handleComponentLayout = function (_a, name, absolute) {
    var nativeEvent = _a.nativeEvent;
    /**
     * We don't want to disable the scroll if we are not using adjustToContentHeight props.
     * Also, if the component is in absolute positioning we don't want to take in
     * account its dimensions, so we just skip.
     */
    if (!adjustToContentHeight || absolute) {
      return;
    }
    handleBaseLayout(name, nativeEvent.layout.height);
  };
  var handleClose = function (dest, callback) {
    if (onClose) {
      onClose();
    }
    handleAnimateClose(dest, callback);
  };
  var handleChildren = function (_a, type) {
    var nativeEvent = _a.nativeEvent;
    var timing = closeAnimationConfig.timing;
    var velocityY = nativeEvent.velocityY,
      translationY = nativeEvent.translationY;
    var negativeReverseScroll =
      modalPosition === 'top' &&
      beginScrollYValue >= (snapPoint ? 0 : SCROLL_THRESHOLD) &&
      translationY < 0;
    var thresholdProps = translationY > threshold && beginScrollYValue === 0;
    var closeThreshold = velocity
      ? (beginScrollYValue <= 20 && velocityY >= velocity) || thresholdProps
      : thresholdProps;
    var enableBouncesValue = true;
    // We make sure to reset the value if we are dragging from the children
    if (type !== 'component' && cancelTranslateY._value === 0) {
      componentTranslateY.setValue(0);
    }
    /*
     * When the pan gesture began we check the position of the ScrollView "cursor".
     * We cancel the translation animation if the ScrollView is not scrolled to the top
     */
    if (nativeEvent.oldState === react_native_gesture_handler_1.State.BEGAN) {
      setCancelClose(false);
      if (
        !closeSnapPointStraightEnabled && snapPoint
          ? beginScrollYValue > 0
          : beginScrollYValue > 0 || negativeReverseScroll
      ) {
        setCancelClose(true);
        translateY.setValue(0);
        dragY.setValue(0);
        cancelTranslateY.setValue(0);
        enableBouncesValue = true;
      } else {
        cancelTranslateY.setValue(1);
        enableBouncesValue = false;
        if (!tapGestureEnabled) {
          setDisableScroll(
            (Boolean(snapPoint) || Boolean(alwaysOpen)) && modalPosition === 'initial',
          );
        }
      }
    }
    setEnableBounces(
      devices_1.isAndroid
        ? false
        : alwaysOpen
        ? beginScrollYValue > 0 || translationY < 0
        : enableBouncesValue,
    );
    if (nativeEvent.oldState === react_native_gesture_handler_1.State.ACTIVE) {
      var toValue = translationY - beginScrollYValue;
      var destSnapPoint_1 = 0;
      if (snapPoint || alwaysOpen) {
        var endOffsetY_1 = lastSnap + toValue + dragToss * velocityY;
        /**
         * snapPoint and alwaysOpen use both an array of points to define the first open state and the final state.
         */
        snaps.forEach(function (snap) {
          var distFromSnap = Math.abs(snap - endOffsetY_1);
          var diffPoint = Math.abs(destSnapPoint_1 - endOffsetY_1);
          // For snapPoint
          if (distFromSnap < diffPoint && !alwaysOpen) {
            if (closeSnapPointStraightEnabled) {
              if (modalPosition === 'initial' && negativeReverseScroll) {
                destSnapPoint_1 = snap;
                willCloseModalize = false;
              }
              if (snap === endHeight) {
                destSnapPoint_1 = snap;
                willCloseModalize = true;
                handleClose();
              }
            } else {
              destSnapPoint_1 = snap;
              willCloseModalize = false;
              if (snap === endHeight) {
                willCloseModalize = true;
                handleClose();
              }
            }
          }
          // For alwaysOpen props
          if (distFromSnap < diffPoint && alwaysOpen && beginScrollYValue <= 0) {
            destSnapPoint_1 = (modalHeightValue || 0) - alwaysOpen;
            willCloseModalize = false;
          }
        });
      } else if (closeThreshold && !alwaysOpen && !cancelClose) {
        willCloseModalize = true;
        handleClose();
      }
      if (willCloseModalize) {
        return;
      }
      setLastSnap(destSnapPoint_1);
      translateY.extractOffset();
      translateY.setValue(toValue);
      translateY.flattenOffset();
      dragY.setValue(0);
      if (alwaysOpen) {
        react_native_1.Animated.timing(overlay, {
          toValue: Number(destSnapPoint_1 <= 0),
          duration: timing.duration,
          easing: react_native_1.Easing.ease,
          useNativeDriver: USE_NATIVE_DRIVER,
        }).start();
      }
      react_native_1.Animated.spring(translateY, {
        tension: 50,
        friction: 12,
        velocity: velocityY,
        toValue: destSnapPoint_1,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
      if (beginScrollYValue <= 0) {
        var modalPositionValue = destSnapPoint_1 <= 0 ? 'top' : 'initial';
        if (panGestureAnimatedValue) {
          react_native_1.Animated.timing(panGestureAnimatedValue, {
            toValue: Number(modalPositionValue === 'top'),
            duration: PAN_DURATION,
            easing: react_native_1.Easing.ease,
            useNativeDriver: useNativeDriver,
          }).start();
        }
        if (!adjustToContentHeight && modalPositionValue === 'top') {
          setDisableScroll(false);
        }
        if (onPositionChange && modalPosition !== modalPositionValue) {
          onPositionChange(modalPositionValue);
        }
        if (modalPosition !== modalPositionValue) {
          setModalPosition(modalPositionValue);
        }
      }
    }
  };
  var handleComponent = function (_a) {
    var nativeEvent = _a.nativeEvent;
    // If we drag from the HeaderComponent/FooterComponent/FloatingComponent we allow the translation animation
    if (nativeEvent.oldState === react_native_gesture_handler_1.State.BEGAN) {
      componentTranslateY.setValue(1);
      beginScrollY.setValue(0);
    }
    handleChildren({ nativeEvent: nativeEvent }, 'component');
  };
  var handleOverlay = function (_a) {
    var nativeEvent = _a.nativeEvent;
    if (
      nativeEvent.oldState === react_native_gesture_handler_1.State.ACTIVE &&
      !willCloseModalize
    ) {
      if (onOverlayPress) {
        onOverlayPress();
      }
      var dest = !!alwaysOpen ? 'alwaysOpen' : 'default';
      handleClose(dest);
    }
  };
  var handleGestureEvent = react_native_1.Animated.event(
    [{ nativeEvent: { translationY: dragY } }],
    {
      useNativeDriver: USE_NATIVE_DRIVER,
      listener: function (_a) {
        var _b;
        var translationY = _a.nativeEvent.translationY;
        if (panGestureAnimatedValue) {
          var offset =
            (_b = alwaysOpen !== null && alwaysOpen !== void 0 ? alwaysOpen : snapPoint) !== null &&
            _b !== void 0
              ? _b
              : 0;
          var diff = Math.abs(translationY / (endHeight - offset));
          var y = translationY <= 0 ? diff : 1 - diff;
          var value_1;
          if (modalPosition === 'initial' && translationY > 0) {
            value_1 = 0;
          } else if (modalPosition === 'top' && translationY <= 0) {
            value_1 = 1;
          } else {
            value_1 = y;
          }
          panGestureAnimatedValue.setValue(value_1);
        }
      },
    },
  );
  var renderHandle = function () {
    var handleStyles = [styles_1['default'].handle];
    var shapeStyles = [styles_1['default'].handle__shape, handleStyle];
    if (!withHandle) {
      return null;
    }
    if (!isHandleOutside) {
      handleStyles.push(styles_1['default'].handleBottom);
      shapeStyles.push(styles_1['default'].handle__shapeBottom, handleStyle);
    }
    return (
      <react_native_gesture_handler_1.PanGestureHandler
        enabled={panGestureEnabled}
        simultaneousHandlers={tapGestureModalizeRef}
        shouldCancelWhenOutside={false}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleComponent}
      >
        <react_native_1.Animated.View style={handleStyles}>
          <react_native_1.View style={shapeStyles} />
        </react_native_1.Animated.View>
      </react_native_gesture_handler_1.PanGestureHandler>
    );
  };
  var renderElement = function (Element) {
    return typeof Element === 'function' ? Element() : Element;
  };
  var renderComponent = function (component, name) {
    var _a;
    if (!component) {
      return null;
    }
    var tag = renderElement(component);
    /**
     * Nesting Touchable/ScrollView components with RNGH PanGestureHandler cancels the inner events.
     * Until a better solution lands in RNGH, I will disable the PanGestureHandler for Android only,
     * so inner touchable/gestures are working from the custom components you can pass in.
     */
    if (devices_1.isAndroid && !panGestureComponentEnabled) {
      return tag;
    }
    var obj = react_native_1.StyleSheet.flatten(
      (_a = tag === null || tag === void 0 ? void 0 : tag.props) === null || _a === void 0
        ? void 0
        : _a.style,
    );
    var absolute = (obj === null || obj === void 0 ? void 0 : obj.position) === 'absolute';
    var zIndex = obj === null || obj === void 0 ? void 0 : obj.zIndex;
    return (
      <react_native_gesture_handler_1.PanGestureHandler
        enabled={panGestureEnabled}
        shouldCancelWhenOutside={false}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleComponent}
      >
        <react_native_1.Animated.View
          style={{ zIndex: zIndex }}
          onLayout={function (e) {
            return handleComponentLayout(e, name, absolute);
          }}
        >
          {tag}
        </react_native_1.Animated.View>
      </react_native_gesture_handler_1.PanGestureHandler>
    );
  };
  var renderContent = function () {
    var _a;
    var keyboardDismissMode = devices_1.isIos ? 'interactive' : 'on-drag';
    var passedOnProps =
      (_a =
        flatListProps !== null && flatListProps !== void 0 ? flatListProps : sectionListProps) !==
        null && _a !== void 0
        ? _a
        : scrollViewProps;
    // We allow overwrites when the props (bounces, scrollEnabled) are set to false, when true we use Modalize's core behavior
    var bounces =
      (passedOnProps === null || passedOnProps === void 0 ? void 0 : passedOnProps.bounces) !==
        undefined &&
      !(passedOnProps === null || passedOnProps === void 0 ? void 0 : passedOnProps.bounces)
        ? passedOnProps === null || passedOnProps === void 0
          ? void 0
          : passedOnProps.bounces
        : enableBounces;
    var scrollEnabled =
      (passedOnProps === null || passedOnProps === void 0
        ? void 0
        : passedOnProps.scrollEnabled) !== undefined &&
      !(passedOnProps === null || passedOnProps === void 0 ? void 0 : passedOnProps.scrollEnabled)
        ? passedOnProps === null || passedOnProps === void 0
          ? void 0
          : passedOnProps.scrollEnabled
        : keyboardToggle || !disableScroll;
    var scrollEventThrottle =
      (passedOnProps === null || passedOnProps === void 0
        ? void 0
        : passedOnProps.scrollEventThrottle) || 16;
    var onScrollBeginDrag =
      passedOnProps === null || passedOnProps === void 0 ? void 0 : passedOnProps.onScrollBeginDrag;
    var opts = {
      ref: compose_refs_1.composeRefs(contentViewRef, contentRef),
      bounces: bounces,
      onScrollBeginDrag: react_native_1.Animated.event(
        [{ nativeEvent: { contentOffset: { y: beginScrollY } } }],
        {
          useNativeDriver: USE_NATIVE_DRIVER,
          listener: onScrollBeginDrag,
        },
      ),
      scrollEventThrottle: scrollEventThrottle,
      onLayout: handleContentLayout,
      scrollEnabled: scrollEnabled,
      keyboardDismissMode: keyboardDismissMode,
    };
    if (flatListProps) {
      return <react_native_1.Animated.FlatList {...flatListProps} {...opts} />;
    }
    if (sectionListProps) {
      return <react_native_1.Animated.SectionList {...sectionListProps} {...opts} />;
    }
    if (customRenderer) {
      var tag = renderElement(customRenderer);
      return React.cloneElement(tag, __assign({}, opts));
    }
    return (
      <react_native_1.Animated.ScrollView {...scrollViewProps} {...opts}>
        {children}
      </react_native_1.Animated.ScrollView>
    );
  };
  var renderChildren = function () {
    var style = adjustToContentHeight
      ? styles_1['default'].content__adjustHeight
      : styles_1['default'].content__container;
    var minDist = libraries_1.isRNGH2() ? undefined : ACTIVATED;
    return (
      <react_native_gesture_handler_1.PanGestureHandler
        ref={panGestureChildrenRef}
        enabled={panGestureEnabled}
        simultaneousHandlers={[nativeViewChildrenRef, tapGestureModalizeRef]}
        shouldCancelWhenOutside={false}
        onGestureEvent={handleGestureEvent}
        minDist={minDist}
        activeOffsetY={ACTIVATED}
        activeOffsetX={ACTIVATED}
        onHandlerStateChange={handleChildren}
      >
        <react_native_1.Animated.View style={[style, childrenStyle]}>
          <react_native_gesture_handler_1.NativeViewGestureHandler
            ref={nativeViewChildrenRef}
            waitFor={tapGestureModalizeRef}
            simultaneousHandlers={panGestureChildrenRef}
          >
            {renderContent()}
          </react_native_gesture_handler_1.NativeViewGestureHandler>
        </react_native_1.Animated.View>
      </react_native_gesture_handler_1.PanGestureHandler>
    );
  };
  var renderOverlay = function () {
    var pointerEvents =
      alwaysOpen && (modalPosition === 'initial' || !modalPosition) ? 'box-none' : 'auto';
    return (
      <react_native_gesture_handler_1.PanGestureHandler
        enabled={panGestureEnabled}
        simultaneousHandlers={tapGestureModalizeRef}
        shouldCancelWhenOutside={false}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleChildren}
      >
        <react_native_1.Animated.View
          style={styles_1['default'].overlay}
          pointerEvents={pointerEvents}
        >
          {showContent && (
            <react_native_gesture_handler_1.TapGestureHandler
              ref={tapGestureOverlayRef}
              enabled={closeOnOverlayTap !== undefined ? closeOnOverlayTap : panGestureEnabled}
              onHandlerStateChange={handleOverlay}
            >
              <react_native_1.Animated.View
                style={[
                  styles_1['default'].overlay__background,
                  overlayStyle,
                  {
                    opacity: overlay.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ]}
                pointerEvents={pointerEvents}
              />
            </react_native_gesture_handler_1.TapGestureHandler>
          )}
        </react_native_1.Animated.View>
      </react_native_gesture_handler_1.PanGestureHandler>
    );
  };
  React.useImperativeHandle(ref, function () {
    return {
      open: function (dest) {
        if (onOpen) {
          onOpen();
        }
        handleAnimateOpen(alwaysOpen, dest);
      },
      close: function (dest, callback) {
        handleClose(dest, callback);
      },
    };
  });
  React.useEffect(
    function () {
      if (alwaysOpen && (modalHeightValue || adjustToContentHeight)) {
        handleAnimateOpen(alwaysOpen);
      }
    },
    [alwaysOpen, modalHeightValue],
  );
  React.useEffect(
    function () {
      invariant_1.invariant(
        modalHeight && adjustToContentHeight,
        "You can't use both 'modalHeight' and 'adjustToContentHeight' props at the same time. Only choose one of the two.",
      );
      invariant_1.invariant(
        (scrollViewProps || children) && flatListProps,
        "You have defined 'flatListProps' along with 'scrollViewProps' or 'children' props. Remove 'scrollViewProps' or 'children' or 'flatListProps' to fix the error.",
      );
      invariant_1.invariant(
        (scrollViewProps || children) && sectionListProps,
        "You have defined 'sectionListProps'  along with 'scrollViewProps' or 'children' props. Remove 'scrollViewProps' or 'children' or 'sectionListProps' to fix the error.",
      );
    },
    [
      modalHeight,
      adjustToContentHeight,
      scrollViewProps,
      children,
      flatListProps,
      sectionListProps,
    ],
  );
  React.useEffect(
    function () {
      setModalHeightValue(adjustValue);
    },
    [adjustToContentHeight, modalHeight, screenHeight],
  );
  React.useEffect(function () {
    var keyboardShowListener = null;
    var keyboardHideListener = null;
    var beginScrollYListener = beginScrollY.addListener(function (_a) {
      var value = _a.value;
      return setBeginScrollYValue(value);
    });
    if (libraries_1.isBelowRN65) {
      react_native_1.Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      react_native_1.Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    } else {
      keyboardShowListener = react_native_1.Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardShow,
      );
      keyboardHideListener = react_native_1.Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardHide,
      );
    }
    return function () {
      var _a;
      (_a = backButtonListenerRef.current) === null || _a === void 0 ? void 0 : _a.remove();
      beginScrollY.removeListener(beginScrollYListener);
      if (libraries_1.isBelowRN65) {
        react_native_1.Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
        react_native_1.Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
      } else {
        keyboardShowListener === null || keyboardShowListener === void 0
          ? void 0
          : keyboardShowListener.remove();
        keyboardHideListener === null || keyboardHideListener === void 0
          ? void 0
          : keyboardHideListener.remove();
      }
    };
  }, []);
  var keyboardAvoidingViewProps = {
    keyboardVerticalOffset: keyboardAvoidingOffset,
    behavior: keyboardAvoidingBehavior,
    enabled: avoidKeyboardLikeIOS,
    style: [
      styles_1['default'].modalize__content,
      modalStyle,
      {
        height: modalHeightValue,
        maxHeight: endHeight,
        transform: [
          {
            translateY: value.interpolate({
              inputRange: [-40, 0, endHeight],
              outputRange: [0, 0, endHeight],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    ],
  };
  if (!avoidKeyboardLikeIOS && !adjustToContentHeight) {
    keyboardAvoidingViewProps.onLayout = handleModalizeContentLayout;
  }
  var renderModalize = (
    <react_native_1.View
      style={[styles_1['default'].modalize, rootStyle]}
      pointerEvents={alwaysOpen || !withOverlay ? 'box-none' : 'auto'}
    >
      <react_native_gesture_handler_1.TapGestureHandler
        ref={tapGestureModalizeRef}
        maxDurationMs={tapGestureEnabled ? 100000 : 50}
        maxDeltaY={lastSnap}
        enabled={panGestureEnabled}
      >
        <react_native_1.View style={styles_1['default'].modalize__wrapper} pointerEvents="box-none">
          {showContent && (
            <AnimatedKeyboardAvoidingView {...keyboardAvoidingViewProps}>
              {renderHandle()}
              {renderComponent(HeaderComponent, 'header')}
              {renderChildren()}
              {renderComponent(FooterComponent, 'footer')}
            </AnimatedKeyboardAvoidingView>
          )}

          {withOverlay && renderOverlay()}
        </react_native_1.View>
      </react_native_gesture_handler_1.TapGestureHandler>

      {renderComponent(FloatingComponent, 'floating')}
    </react_native_1.View>
  );
  var renderReactModal = function (child) {
    return (
      <react_native_1.Modal
        {...reactModalProps}
        supportedOrientations={['landscape', 'portrait', 'portrait-upside-down']}
        onRequestClose={handleBackPress}
        hardwareAccelerated={USE_NATIVE_DRIVER}
        visible={isVisible}
        transparent
      >
        {child}
      </react_native_1.Modal>
    );
  };
  if (!isVisible) {
    return null;
  }
  if (withReactModal) {
    return renderReactModal(renderModalize);
  }
  return renderModalize;
};
exports.Modalize = React.forwardRef(ModalizeBase);
