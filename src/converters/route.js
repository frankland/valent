import Url from '../components/url';
import Config from '../components/config';
import Router from '../components/router';

var RouterModel = Router.model;

function Convert(RouteModel) {

  var config = {
    controller: RouteModel.controller,
    reloadOnSearch: false,
    resolve: angular.extend(RouteModel.resolve, RouterModel.resolve)
  };

  if (RouteModel.template && RouteModel.templateUrl) {
    throw new Error(`For route "${RouteModel.url}" @template and @templateUrl is described`);
  }

  if (RouteModel.template) {
    config.template = RouteModel.template;
  } else if (RouteModel.templateUrl) {
    config.templateUrl = RouteModel.templateUrl;
  } else {
    throw new Error('@template or @templateUrl should be described');
  }

  if (RouteModel.hasGenerator()) {
    Url.addRoute(RouteModel.controller, RouteModel.getGenerator());
  }

  return {
    urls: RouteModel.urls,
    config: config
  };
}

function byModule(routes) {
  var sorted = {};

  for (var route of routes) {

    var RouteModel = route.model;
    var moduleName = RouteModel.module;

    if (!moduleName) {
      throw new Error(`Module is not defined for route "${RouteModel.url}"`);
    }

    if (!sorted.hasOwnProperty(moduleName)) {
      sorted[moduleName] = [];
    }

    sorted[moduleName].push(RouteModel);
  }

  return sorted;
}


export default function(routes) {
  var sorted = byModule(routes);
  var app = Config.getApplicationName();

  angular.module(app).config(['$locationProvider', '$routeProvider',
    ($locationProvider, $routeProvider) => {
      if (RouterModel.isHtml5()) {
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        })
      }

      var otherwise = RouterModel.getOtherwise();
      if (otherwise) {
        $routeProvider.otherwise(otherwise);
      }
    }]);

  for (var name of Object.keys(sorted)) {
    angular.module(name)
        .config([RouterModel.provider, ($routeProvider) => {
          for (var RouteModel of sorted[name]) {
            var {urls, config} = Convert(RouteModel);
            var base = RouterModel.base;

            for (var url of urls) {
              $routeProvider.when(base + url, config);
            }
          }
        }]);
  }
};

