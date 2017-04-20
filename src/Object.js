import { BaseType, coerce } from './base';
import nativeTypeMap from './nativeTypeMap';

export default class ObjectType extends BaseType {
  static isOfType(val) {
    return typeof val === 'object' && !Array.isArray(val) && val !== null;
  }

  static withDefinition(definition) {
    const coercedDefinition = Object.keys(definition).reduce((o, key) => {
      o[key] = coerce(definition[key]);
      return o;
    }, {});
    return class ObjectWithDefinition extends this {
      static get properties() {
        return coercedDefinition;
      }

      static get strict() {
        return strict(this);
      }

      static isOfType(val) {
        return super.isOfType(val)
          && Object.keys(definition).every((key) => this.properties[key].isOfType(val[key]));
      }
    };
  }

  static keyValuePair(valueType) {
    const coercedValueType = coerce(valueType);
    return class ObjectKeyValuePair extends this {
      static get valueType() {
        return coercedValueType;
      }

      static isOfType(val) {
        return super.isOfType(val)
          && Object.keys(val).every(key => this.valueType.isOfType(val[key]));
      }
    }
  }
}

export function strict(type) {
  const coercedType = coerce(type);

  if (!(coercedType.prototype instanceof ObjectType)) {
    console.error('strict() is only intended for use with objects');
    return type;
  }

  return class ObjectWithDefinitionStrict extends type {
    static isOfType(val) {
      return super.isOfType(val)
        && Object.keys(val).every(key => !!this.properties[key]);
    }
  }
}

nativeTypeMap.set(Object, ObjectType);
