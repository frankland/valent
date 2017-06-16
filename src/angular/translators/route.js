import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';

import AngularUrl from '../angular-url';

let resolve = (resolvers, args = {}) => {
  let dependencies = Object.keys(resolvers);

  let tasks = [];
  for (let key of Object.keys(resolvers)) {
    let resolver = resolvers[key];

    let task = resolver(...args);

    tasks.push(task);
  }

  return Promise.all(tasks).then(resolved => {
    let results = {};
    let index = 0;

    for (let resolverResult of resolved) {
      let key = dependencies[index];
      results[key] = resolverResult;

      index++;
    }

    return results;
  });
};

let getValentResolver = (config, routeModel) => ({
  'valent.resolve': () => {
    let globalResolvers = config.route.getResolvers();

    let name = routeModel.getName();
    let params = routeModel.getParams();

    let resolverArguments = [name, params];

    let result = {};

    if (config.route.hasResolvers()) {
      result = resolve(
        globalResolvers,
        resolverArguments
      ).then(globalResult => {
        let resolveResult = null;

        if (routeModel.hasResolvers()) {
          let localResolvers = routeModel.getResolvers();

          resolveResult = resolve(
            localResolvers,
            resolverArguments
          ).then(localResult => {
            return Object.assign({}, globalResult, localResult);
          });
        } else {
          resolveResult = globalResult;
        }

        return resolveResult;
      });
    } else if (routeModel.hasResolvers()) {
      let localResolvers = routeModel.getResolvers();
      result = resolve(localResolvers, resolverArguments);
    }

    return result;
  },
});

export default (routeModel, config) => {
  let name = routeModel.getName();
  let module = routeModel.getModule();

  let params = routeModel.getParams();
  let defaultRouteParams = {
    reloadOnSearch: false,
  };

  let configuration = Object.assign(defaultRouteParams, params, {
    controller: name,
  });

  let globalResolvers = config.route.getResolvers();

  if (!!Object.keys(globalResolvers).length || routeModel.hasResolvers()) {
    configuration.resolve = getValentResolver(config, routeModel);
  }

  if (routeModel.hasTemplate()) {
    // set template
    let template = routeModel.getTemplate();
    if (isFunction(template)) {
      configuration.template = template.bind(routeModel);
    } else {
      configuration.template = template;
    }
  } else if (routeModel.hasTemplateUrl()) {
    // set templateUrl
    configuration.templateUrl = routeModel.getTemplateUrl();
  }

  let routes = null;
  let url = null;

  if (!routeModel.isOtherwise()) {
    routes = routeModel.getUrl();
    if (!isArray(routes)) {
      routes = [routes];
    }

    // create URL
    let structure = routeModel.getStructure();
    let pattern = routes[0];

    url = () => {
      // ?
      return new AngularUrl(pattern, structure);
    };
  }

  return {
    name,
    module,
    routes,
    url,
    configuration,
  };
};
