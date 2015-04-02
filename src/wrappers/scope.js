import Config from '../components/config';
import Logger from '../components/logger';
import Injector from '../components/injector';

var scopeKey = Symbol('$scope');

export default class Scope {
  constructor(name, $scope) {
    /**
     * private attributes
     */
    this[scopeKey] = $scope;

    /**
     * public attributes
     */
    this.logger = Logger.create(name);
    this.transition = new Map();

    this.parse = Injector.get('$parse');

    this.controller = name;
    this.pushCounter = 0;
  }

  getOriginalScope() {
    return this[scopeKey];
  }

  getLogger() {
    return this.logger;
  }

  getTransition() {
    return this.transition;
  }

  /**
   * Scope methods
   */
  getter(key) {
    var parse = this.parse;
    return parse(key);
  }

  setter(key) {
    return this.getter(key).assign;
  }

  get(key) {
    var getter = this.getter(key);
    var scope = this[scopeKey];
    return getter(scope);
  }

  assign(key) {
    var scope = this[scopeKey];
    return this.getter(key).bind(null, scope);
  }

  log(message) {
    var logger = this.getLogger();

    logger.log(message);
  }

  error(message) {
    var logger = this.getLogger();
    var completeMessage = logger.getCompleteMessage(message);

    throw new Error(completeMessage);
  }

  clearTransition() {
    this.transition.clear();
  }

  commit(key, value) {
    var scopeState = this.getTransition();
    scopeState.set(key, value);
  }

  push() {
    var pushCounter = ++this.pushCounter;
    var logger = this.getLogger();

    if (arguments.length == 2) {
      this.commit.apply(this, arguments);
    } else if (!!arguments.length) {
      logger.warn('Wrong arguments for scopeApi.push');
    }

    var transition = this.getTransition();

    var keys = [];
    transition.forEach((value, key) => keys.push(key));

    var message = `#${pushCounter} push ${transition.size} changes: [${keys.join(', ')}]`;
    logger.log(message, transition);

    var scope = this[scopeKey];

    transition.forEach((value, key) => {
      var setter = this.setter(key);
      var current = this.get(key);

      if (angular.equals(value, current)) {
        var equalsMessage = `value by path "${key}" is not changed`;
        logger.log(equalsMessage, value);
      } else {
        setter(scope, value);
      }
    });

    this.clearTransition();
  }

  safeApply(fn) {
    var scope = this[scopeKey];

    var phase = scope.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(angular.isFunction(fn)) {
        fn();
      }
    } else {
      scope.$apply(fn);
    }
  };

  pushAndApply(...args) {
    this.safeApply(() => this.push(...args));
  }

  force(...args) {
    this.safeApply(() => this.push(...args));
  }
}

