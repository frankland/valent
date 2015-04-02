class RouterModel {
  constructor() {
    this.resolve = {};
    this.base = '';
    this.html5 = true;
    this.provider = '$routeProvider';
  }

  isHtml5() {
    return !!this.html5;
  }

  getOtherwise() {
    var otherwise = null;
    if (angular.isObject(this.otherwise)) {
      otherwise = this.otherwise;
    } else if (angular.isString(this.otherwise)) {
      otherwise = {
        redirectTo: this.otherwise
      };
    }

    return otherwise;
  }
}


class Router {
  constructor() {
    this.model = new RouterModel();
  }

  html5(html5) {
    this.model.html5 = !html5;
  }

  otherwise(otherwise) {
    this.model.otherwise = otherwise;
    return this;
  }

  base(base) {
    this.model.base = base;
    return this;
  }

  resolve(key, expression) {
    this.model.resolve[key] = expression;
    return this;
  }

  provider(provider) {
    this.model.provider = provider;
  }
}

export default new Router();
