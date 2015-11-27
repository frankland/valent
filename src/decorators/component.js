import { getControllerName } from './controller';

export default options => target => {
  valent.component(getControllerName(target), target, options);
};