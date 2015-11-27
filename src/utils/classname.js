import isFunction from 'lodash/lang/isFunction';

const CONSTRUCTOR_NAME_FUNC = 'Function';

export default object => {
  if (!isFunction(object)) {
    throw new TypeError('Given argument is not a class');
  }
  
  let constructorName = object.prototype.constructor.name;
  
  // anonymous functions don't have constructor name
  if ((CONSTRUCTOR_NAME_FUNC === constructorName) || !constructorName.length) {
    return null;
  }
  
  return constructorName;
};
