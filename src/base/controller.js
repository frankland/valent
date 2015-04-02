import Injector from '../components/injector';
import Url from '../components/url';

var unsubscribe = Symbol('unsubscribe');

export default class Controller {

  constructor(scope) {
    this.scope = scope;
    this.injector = Injector;

    this[unsubscribe] = [];
  }

  getScope() {
    return this.scope;
  }

  error(message) {
    this.scope.error(message);
  }

  url() {
    return Url.get(this.scope.controller).apply(null, arguments);
  }

  /**
   * Scope shortcuts
   */
  push() {
    this.scope.push.apply(this.scope, arguments);
    return this;
  }

  pushAndApply() {
    this.scope.pushAndApply.apply(this.scope, arguments);
  }

  force() {
    this.scope.force.apply(this.scope, arguments);
  }

  commit() {
    this.scope.commit.apply(this.scope, arguments);
    return this;
  }

  get() {
    return this.scope.get.apply(this.scope, arguments);
  }

  /**
   * Injector shortcut
   */
  dep() {
    return this.injector.get.apply(this.injector, arguments);
  }

  /**
   * Directive Pipe
   */
  listen(pipe, event, func) {
    this.addUnsubscribe(pipe.listen(event, func));
  }

  addUnsubscribe(func) {
    var storage = this[unsubscribe];
    storage.push(func);
  }

  onDestroy() {
    var storage = this[unsubscribe];

    for (var detach of storage) {
      detach();
    }
  }
}
