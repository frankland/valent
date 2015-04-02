import Config from '../components/config';
import Router from '../components/router';

class RouteModel {
  constructor(name) {
    if (name) {
      this.controller = name;
    }

    this.urls =[];

    this.generator = null;
    this.resolve = {};
  }

  hasUrl() {
    return !!this.urls.length;
  }

  hasGenerator() {
    return this.generator || this.urls.length == 1;
  }

  getGenerator() {
    if (!this.hasGenerator()) {
      throw new Error('Url generator is not available');
    }

    var generator = null;

    if (angular.isFunction(this.generator)) {
      generator = this.generator;
    } else {
      generator = (function(url){
        return () => url;
      })(this.urls[0]);
    }

    return generator;
  }
}


export default class RouteFlow {
  constructor(controller) {
    this.model = new RouteModel(controller);
  }

  at(name) {
    this.model.module = name;
    return this;
  }

  hasModule() {
    return !!this.model.module;
  }

  url(url) {
    this.model.urls.push(url);
    return this;
  }

  generate(generator) {
    this.model.generator = generator;

    return this;
  }


  base(url) {
    this.model.base = url;
  }

  resolve(key, expr) {
    this.model.resolve[key] = expr;

    return this;
  }

  //controller(controller) {
  //  this.model.controller = controller;
  //
  //  return this;
  //}

  template(template) {
    this.model.template = template;

    return this;
  }

  templateUrl(templateUrl) {
    this.model.templateUrl = templateUrl;

    return this;
  }

  logInfo() {
    var group = `${this.model.controller}`;
    var resolve = Object.keys(this.model.resolve);

    console.groupCollapsed(group);
    console.log(`base: ${Router.model.base}`);

    for (var url of this.model.urls) {
      console.log(`url: ${url}`);
    }

    if (this.model.templateUrl) {
      console.log(`templateUrl: ${this.model.templateUrl}`);
    } else if (this.model.template) {
      console.log(`template: ${this.model.template.slice(0, 200).replace(/\n|\r|\r\n/mg, '')}...`);
    } else {
      console.error(`template is not defined`);
    }

    if (resolve.length) {
      console.log(`resolve: '${resolve}`);
    }
    console.groupEnd(group);
  }
}
