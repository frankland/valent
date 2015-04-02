import ControllerConverter from './converters/controller';
import DirectiveConverter from './converters/directive';
import FactoryConverter from './converters/factory';
import RouteConverter from './converters/route';
import Injector from './components/injector';
import Config from './components/config';


export default class Manager {
  constructor() {
    this.storage = {
      controller: [],
      factory: [],
      route: [],
      directive: []
    };
  }

  controller(component) {
    this.storage.controller.push(component);
  }

  factory(component) {
    this.storage.factory.push(component);
  }

  route(component) {
    this.storage.route.push(component);
  }

  directive(component) {
    this.storage.directive.push(component);
  }

  statistics() {
    var storage = this.storage;
    var types = Object.keys(storage);

    var main = 'Valent statistics';
    console.groupCollapsed(main);

    for (var type of types) {
      var total = storage[type].length;

      if (total) {
        var components = storage[type],
            group = `${type}  (${total})`;

        console.group(group);

        for (var component of components) {

          if (angular.isFunction(component.logInfo)) {
            component.logInfo();
          } else {
            console.log(`${component.name} at ${component.module}`);
          }
        }

        console.groupEnd(group);
      }
    }

    console.groupEnd(main);
  }

  register() {
    var app = Config.getApplicationName();

    //createApplication(app);
    initializeInjector(app);

    registerComponents(app, this.storage.controller, ControllerConverter);
    registerComponents(app, this.storage.directive, DirectiveConverter);
    registerComponents(app, this.storage.factory, FactoryConverter);
    registerRoutes(app, this.storage.route);
  }
}

function initializeInjector(app) {
  angular.module(app)
      .run(['$injector', function($injector) {
        Injector.setInjector($injector);
      }]);
}

function createApplication(app) {
  angular.module(app, []);
}

function registerRoutes(app, routes){
  if (app) {
    for (var route of routes) {
      if (!route.hasModule()) {
        route.at(app);
      }
    }
  }

  RouteConverter(routes);
}

function registerComponents(app, components, register) {
  for (var component of components) {
    if (!component.hasModule()) {
      component.at(app);
    }

    register(component);
  }
}
