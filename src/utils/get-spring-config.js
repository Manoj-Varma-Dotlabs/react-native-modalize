'use strict';
exports.__esModule = true;
exports.getSpringConfig = void 0;
var invariant_1 = require('./invariant');
exports.getSpringConfig = function (config) {
  var friction = config.friction,
    tension = config.tension,
    speed = config.speed,
    bounciness = config.bounciness,
    stiffness = config.stiffness,
    damping = config.damping,
    mass = config.mass;
  if (stiffness || damping || mass) {
    invariant_1.invariant(
      bounciness || speed || tension || friction,
      'You can define one of bounciness/speed, tension/friction, or stiffness/damping/mass, but not more than one',
    );
    return {
      stiffness: stiffness,
      damping: damping,
      mass: mass,
    };
  } else if (bounciness || speed) {
    invariant_1.invariant(
      tension || friction || stiffness || damping || mass,
      'You can define one of bounciness/speed, tension/friction, or stiffness/damping/mass, but not more than one',
    );
    return {
      bounciness: bounciness,
      speed: speed,
    };
  }
  return {
    tension: tension,
    friction: friction,
  };
};
