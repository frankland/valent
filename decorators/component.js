'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _controller = require('./controller');

exports['default'] = function (options) {
  return function (target) {
    valent.component((0, _controller.getControllerName)(target), target, options);
  };
};

module.exports = exports['default'];