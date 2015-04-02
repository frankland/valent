import Controller from './controller';

var unsubscribeKey = Symbol('unsubscribe-storage');

export default class DirectiveController extends Controller {

  constructor(scope, injector) {
    super(scope, injector);

    this.pipe = this.scope.getPipe();
  }

  listen() {
    var pipe;
    var event;
    var func;

    if (arguments.length === 3) {
      pipe = arguments[0];
      event = arguments[1];
      func = arguments[2];
    } else {
      pipe = this.pipe;
      event = arguments[0];
      func = arguments[1];
    }

    super.listen(pipe, event, func);
  }

  sync() {
    this.pipe.sync();
  }

  syncState() {
    this.listen('sync', (state) => this.push('state', state));
  }
}
