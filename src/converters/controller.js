import Scope from '../wrappers/scope';
import Config from '../components/config';
import Router from '../components/router';

var RouterModel = Router.model;

function Convert(ControllerModel) {

  var ControllerFunction = function($scope, ...dependencies) {
    var ControllerConstructor = ControllerModel.src;

    if (typeof ControllerConstructor != 'function') {
      throw new Error('Wrong controller source definition. Expect function (constructor)');
    }

    /**
     * Create scope logger
     */
    var scope = new Scope(ControllerModel.name, $scope);

    var ControllerInstance = new ControllerConstructor(...[scope].concat(dependencies));
    $scope.controller = ControllerInstance;

    $scope.$on('$destroy', function() {
      if (angular.isFunction(ControllerInstance.onDestroy)) {
        ControllerInstance.onDestroy();
      }
    });
  };

  var resolve = Object.keys(RouterModel.resolve);
  var deps = resolve.concat(ControllerModel.dependencies);

  return ['$scope'].concat([...deps, ControllerFunction]);
}


export default function(controller) {
  var ControllerModel = controller.model;

  var moduleName = ControllerModel.module;

  if (!moduleName) {
    throw new Error(`Module is not defined for controller: "${ControllerModel.name}"`);
  }

  if (!ControllerModel.src) {
    throw new Error('Controller source is not defined');
  }

  var di = Convert(ControllerModel);

  angular.module(moduleName)
      .controller(ControllerModel.name, di);
};

