import { expect } from 'chai';

import manager from '../src/index';
import { Manager } from '../src/index';

import ControllerModel from '../src/controller/controller-model';

class CustomControllerModel extends ControllerModel {}

describe('Manager', () => {
  it('should be an object if import default', () => {
    expect(Manager).to.be.a('function');
  });

  it('should be a function ect if import { Manager }', () => {
    expect(Manager).to.be.a('function');
  });

  it('should have methods to add components', () => {
    expect(manager.addController).to.be.a('function');
    expect(manager.addDirective).to.be.a('function');
    expect(manager.addFactory).to.be.a('function');
    expect(manager.addRoute).to.be.a('function');
  });

  it('should check component instances', () => {
    var manager = new Manager();
    var controller = {};
    expect(() => manager.addController(controller)).to.throw(Error);

    var controllerModel = new ControllerModel('home.dashboard');
    expect(() => manager.addController(controllerModel)).to.be.ok;

    var customControllerModel = new CustomControllerModel('home.dashboard');
    expect(() => manager.addController(customControllerModel)).to.be.ok;
  });
});
