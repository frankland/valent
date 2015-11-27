import isFunction from 'lodash/lang/isFunction';
import endsWith   from 'lodash/string/endsWith';
import capitalize from 'lodash/string/capitalize';

import className from '../utils/classname';

const CONTROLLER_NAME_SUFFIX = 'controller';

export default options => target => {
  if (!isFunction(target)) {
    throw new TypeError('Controller must be a class');
  }
  
  let constructorName = className(target);
  
  if (!endsWith(constructorName, CONTROLLER_NAME_SUFFIX)) {
    throw new Error(`Controller name must ends with ${capitalize(CONTROLLER_NAME_SUFFIX)}`);
  }
  
  let controllerName = constructorName.slice(0, CONTROLLER_NAME_SUFFIX.length);
  
  valent.controller(controllerName, target, options);
};