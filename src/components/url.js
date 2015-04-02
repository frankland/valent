import Router from './router';

class UrlManager {

  constructor() {
    this.routes = {};
  }

  addRoute(namespace, builder) {
    this.routes[namespace] = builder;
  }

  // closures.. closures... closures
  get(controller) {
    if (!this.routes.hasOwnProperty(controller)) {
      throw new Error('Url generator for controller "' + controller + '" does not exist');
    }
    var generator = this.routes[controller];


    return () => {
      var base = Router.model.base;
      var url = generator.apply(null, arguments);

      return base + url;
    };
  }
}


export default new UrlManager();
