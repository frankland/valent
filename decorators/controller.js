'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashLangIsFunction = require('lodash/lang/isFunction');

var _lodashLangIsFunction2 = _interopRequireDefault(_lodashLangIsFunction);

var _lodashStringEndsWith = require('lodash/string/endsWith');

var _lodashStringEndsWith2 = _interopRequireDefault(_lodashStringEndsWith);

var _utilsClassname = require('../utils/classname');

var _utilsClassname2 = _interopRequireDefault(_utilsClassname);

var CONTROLLER_NAME_SUFFIX = 'Controller';

var getControllerName = function getControllerName(target) {
  if (!(0, _lodashLangIsFunction2['default'])(target)) {
    throw new TypeError('Controller must be a class');
  }

  var constructorName = (0, _utilsClassname2['default'])(target);

  if (!(0, _lodashStringEndsWith2['default'])(constructorName, CONTROLLER_NAME_SUFFIX)) {
    throw new Error('Controller name must ends with ' + CONTROLLER_NAME_SUFFIX);
  }

  return constructorName.slice(0, CONTROLLER_NAME_SUFFIX.length).toLowerCase();
};

exports.getControllerName = getControllerName;

exports['default'] = function (options) {
  return function (target) {
    valent.controller(getControllerName(target), target, options);
  };
};