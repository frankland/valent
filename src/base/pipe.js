import EventManager from '../components/event-manager';

var listeners = Symbol('listeners');

export default class Pipe extends EventManager {
  constructor(name) {
    super(name);
    this.state = {};
  }

  getState() {
    return angular.copy(this.state);
  }

  sync() {
    var state = this.getState();
    this.trigger('sync', state);
  }
}
