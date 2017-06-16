import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import Serializer from './serializer';
import t from 'tcomb';

export default class RenameSerializer extends Serializer {
  constructor(struct) {
    let normalizedStruct = {};
    let renameOptions = {};

    let props = struct;

    for (let key of Object.keys(props)) {
      let value = props[key];
      let filedStruct = null;

      if (isArray(value)) {
        renameOptions[key] = value[0];
        filedStruct = value[1];
      } else {
        renameOptions[key] = key;
        filedStruct = value;
      }
      normalizedStruct[key] = filedStruct;
    }

    super(normalizedStruct);

    this.renameOptions = renameOptions;
  }

  encode(params) {
    let encoded = super.encode(params);

    let normalized = {};
    for (let key of Object.keys(encoded)) {
      let value = encoded[key];
      let rename = this.renameOptions[key];

      if (rename) {
        normalized[rename] = value;
      } else {
        normalized[key] = value;
      }
    }

    return normalized;
  }

  hasRenameOption(key) {
    return this.renameOptions[key] !== key;
  }

  getOriginalName(renamed) {
    if (!isString(renamed)) {
      throw new Error('"rename" key must be a string');
    }

    let original = null;

    for (let key of Object.keys(this.renameOptions)) {
      if (this.renameOptions[key] === renamed) {
        original = key;
        break;
      }
    }

    return original;
  }

  decode(params) {
    let normalized = {};
    let struct = this.getStruct();

    for (let key of Object.keys(params)) {
      let value = params[key];
      let original = this.getOriginalName(key);

      if (!original) {
        // TODO: normalize exceptions
        if (!struct.hasOwnProperty(key)) {
          throw new Error(`Url param "${key}" is not described at struct`);
        } else {
          // NOTE: Seems this case is impossible
          throw new Error(`Can not find origin name for "${key}"`);
        }
      }

      if (original) {
        normalized[original] = value;
      } else {
        normalized[key] = value;
      }
    }

    return super.decode(normalized);
  }
}
