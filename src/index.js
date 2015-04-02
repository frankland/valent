import DirectiveFlow from './flow/directive';
import FactoryFlow from './flow/factory';
import ControllerFlow from './flow/controller';
import RouteFlow from './flow/route';
import Manager from './manager';

var manager = new Manager();

export default manager;

export function Directive(name) {
  var component = new DirectiveFlow(name);
  manager.directive(component);

  return component;
}

export function Controller(name) {
  var component = new ControllerFlow(name);
  manager.controller(component);

  return component;
}

export function Route(name) {
  var component = new RouteFlow(name);
  manager.route(component);

  return component;
}

export function Factory(name) {

  var component = new FactoryFlow(name);
  manager.factory(component);

  return component;
}

