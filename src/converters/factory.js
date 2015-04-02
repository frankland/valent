function Convert(FactoryModel) {
  var FactoryConstructor = FactoryModel.src;

  if (!angular.isFunction(FactoryConstructor)) {
    throw new Error('Wrong factory source definition. Expect function (constructor)');
  }

  var FactoryFunction = function(...dependencies) {
    return new FactoryConstructor(dependencies);
  };

  var deps = FactoryModel.dependencies;
  return [...deps, FactoryFunction];
}

export default function(factory) {
  var FactoryModel = factory.model;

  var moduleName = FactoryModel.module;

  if (!moduleName) {
    throw new Error(`Application name is not described for factory: "${FactoryModel.name}"`);
  }

  var di = Convert(FactoryModel);

  angular.module(moduleName)
      .factory(FactoryModel.name, di);
};
