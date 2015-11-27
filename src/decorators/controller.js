import isFunction from 'lodash/lang/isFunction';
import endsWith   from 'lodash/string/endsWith';
import className  from '../utils/classname';

const CONTROLLER_NAME_SUFFIX = 'Controller';

export const getControllerName = target => {
  if (!isFunction(target)) {
    throw new TypeError('Controller must be a class');
  }
  
  let constructorName = className(target);
  
  if (!endsWith(constructorName, CONTROLLER_NAME_SUFFIX)) {
    throw new Error(`Controller name must ends with ${CONTROLLER_NAME_SUFFIX}`);
  }
  
  return constructorName.slice(0, CONTROLLER_NAME_SUFFIX.length).toLowerCase();
};

export default options => target => {
  valent.controller(getControllerName(target), target, options);
};
