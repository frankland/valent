import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';

import Injector from './services/injector';
import Logger from '../utils/logger';

import componentTranslator from './translators/component';
import controllerTranslator from './translators/controller';
import routeTranslator from './translators/route';

import TranslateException from '../exceptions/translate';

import AngularComponent from './angular-component';
import AngularController from './angular-controller';
import AngularRoute from './angular-route';

import AngularUrl from './angular-url';
import AngularUrlManager from './angular-url-manager';

let _app = Symbol('angular-module');
let _urlManager = Symbol('url-manager');

export default class Angular {
  component = AngularComponent;
  controller = AngularController;
  route = AngularRoute;

  translate = {
    component: (component, config) => {
      try {
        var translated = componentTranslator(component, config);
      } catch (error) {
        let name = component.getName();
        throw new TranslateException(name, 'component', error.message);
      }

      let application = translated.module || this[_app];

      angular.module(application)
        .directive(translated.name, () => translated.configuration);
    },

    controller: (controller, config) => {
      try {
        var translated = controllerTranslator(controller, config);
      } catch (error) {
        let name = controller.getName();
        throw new TranslateException(name, error.message);
      }

      let application = translated.module || this[_app];

      angular.module(application)
        .controller(translated.name, translated.configuration);
    },

    route: (route, config) => {
      let name = route.getName();

      try {
        var translated = routeTranslator(route, config);
      } catch (error) {
        throw new TranslateException(name, 'route', error.message);
      }

      let urlManager = this[_urlManager];
      urlManager.set(name, translated.url);

      let application = translated.module || this[_app];

      angular.module(application)
        .config(['$routeProvider', ($routeProvider) => {

          for (let url of translated.routes) {
            $routeProvider.when(url, translated.configuration);
          }
        }]);
    }
  };

  constructor(app, options = {}) {
    if (!app || !isString(app)) {
      throw new Error('Angular module should be a string');
    }

    this[_app] = app;
    this[_urlManager] = new AngularUrlManager();

    if (options.dependencies) {
      angular.module(app, options.dependencies);
    }
  }

  getAngularModule() {
    let app = this[_app];
    return angular.module(app);
  }

  getUrlManager() {
    return this[_urlManager];
  }

  bootstrap(config) {
    let module = this[_app];

    // initialize exception handler
    let exceptionHandler = config.exception.getHandler();
    if (isFunction(exceptionHandler)) {
      angular.module(module).config(['$provide', ($provide) => {

        $provide.decorator('$exceptionHandler', ($delegate) => {
          return (exception, cause) => {

            exceptionHandler(exception, cause, $delegate);
          }
        });
      }]);
    }

    let app = this.getAngularModule();

    /**
     * NOTE: used for controllers if there is no global or local resolver.
     * If remove this factory will be exception
     * "Unknown provider: valent.resolveProvider <- valent.resolve <- root"
     */
    app.factory('valent.resolve', () => null);


    app.config(['$locationProvider', '$routeProvider', ($locationProvider, $routeProvider) => {
      $locationProvider.html5Mode({
        enabled: config.get('routing.html5Mode'),
        requireBase: config.get('routing.requireBase')
      });

      let otherwise = config.get('routing.otherwise');

      if (otherwise) {
        let otherwiseConfig = {};

        if (isString(otherwise)) {
          otherwiseConfig.redirectTo = otherwise;
        } else {
          // TODO: lol
          throw new Error('That is really lol but this case is not implemented ("otherwise" is not a string)');
        }

        $routeProvider.otherwise(otherwiseConfig);
      }
    }]);

    app.run(['$injector', '$rootScope', '$location', ($injector, $rootScope, $location) => {
      // initialize injector
      Injector.setInjector($injector);

      // initialize route events
      let hooks = config.route.getHooks();

      if (isFunction(hooks.error)) {
        $rootScope.$on('$routeChangeError', (event, current, previous, rejection) => {
          hooks.error(event, current, previous, rejection);
        });
      }

      $rootScope.$on('$routeChangeStart', (event, current, previous, rejection) => {
        Logger.resetColors();

        if (isFunction(hooks.start)) {
          hooks.start(event, current, previous, rejection);
        }
      });
    }]);
  }
}
