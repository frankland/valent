import Config from '../components/config';
import Controller from './controller';

function camelCase(input) {
  return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
}

class DirectiveModel {
  constructor(name) {
    if (name) {
      this.name = camelCase(name);
    }

    this.dependencies = [];

    this.replace = true;
    this.scope = {};

    this.controller = new Controller( `<${name}>`);
  }

  hasTemplate() {
    return this.hasOwnProperty('template') || this.hasOwnProperty('templateUrl');
  }

  getRestrict() {
    var restrict = null;

    if (this.hasOwnProperty('restrict')) {
      restrict = this.restrict;
    } else if (this.hasTemplate()) {
      restrict = 'E';
    } else {
      restrict = 'A';
    }

    return restrict;
  }

  hasModel() {
    return !!this.ngModel;
  }

  hasPipe() {
    return this.hasOwnProperty('pipe');
  }

  getControllerModel() {
    return this.controller.model;
  }
}

export default class DirectiveFlow  {

  constructor(name) {
    this.model = new DirectiveModel(name);
  }

  at(name) {
    this.model.module = name;
    return this;
  }

  hasModule() {
    return !!this.model.module;
  }

  dependencies(dependencies) {

    this.model.controller.dependencies(dependencies);
    return this;
  }

  transclude() {
    this.model.transclude = true;

    return this;
  }

  scope(scope) {
    this.model.scope = scope;
    return this;
  }

  restrict(restrict) {
    this.model.restrict = restrict;
    return this;
  }

  pipe(pipe){
    this.model.pipe = pipe;
    return this;
  }

  withModel() {
    this.model.ngModel = true;
    return this;
  }

  controller(controller) {
    this.model.controller.src(controller);
    return this;
  }

  template(template) {
    this.model.template = template;
    return this;
  }

  templateUrl(template) {
    this.model.templateUrl = template;
    return this;
  }

  logInfo() {
    var moduleName = this.model.module || Config.getApplicationName();
    var ControllerModel = this.model.getControllerModel();
    var group = `${ControllerModel.name} at ${moduleName}`;

    console.groupCollapsed(group);

    console.log(`restrict: ${this.model.getRestrict()}`);
    console.log(`replace: ${this.model.replace}`);

    if (!!Object.keys(this.model.scope).length) {
      console.log(`scope:`, this.model.scope);
    }

    if (this.model.templateUrl) {
      console.log(`templateUrl: ${this.model.templateUrl}`);
    } else if (this.model.template) {
      console.log(`template: ${this.model.template.slice(0, 50).replace(/\n|\r|\r\n/mg, '')}`);
    } else {
      console.log(`empty template`);
    }

    console.groupEnd(group);
  }
}
