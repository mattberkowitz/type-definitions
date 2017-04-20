import nativeTypeMap from './nativeTypeMap';

export class BaseType {
  static isOfType(val) {
    console.error(`An isOfType function needs to be defined for "${this.name}"`);
    return false;
  }
  static get optional() {
    return optional(this);
  }
  static get defaultValue() {
    return undefined;
  }
  static create(val = this.defaultValue) {
    // console.log(val, typeof val)
    if (!this.isOfType(val)) {
      throw `The provided default value ${JSON.stringify(val)} does not match the type definition`;
    }
    return val;
  }
  static withDefault(val) {
    if (!this.isOfType(val)) {
      throw `Supplied default ${JSON.stringify(val)} is not a valid value for type`
    }
    return class TypeWithDefault extends this {
      static get definedDefaultValue() {
        return val;
      }
      static get defaultValue() {
        return this.definedDefaultValue;
      }
    }
  }
}

export class UnionType extends BaseType {
  static get types() {
    console.error('This type is meant to be extended with an overrided static `types` property. It\'s suggested to use `Union.ofTypes(...types)` to generate a new union');
    return [];
  }
  static ofTypes(...types) {
    return unionOf(...types);
  }
  static isOfType(val) {
    return this.types.some((type) => type.isOfType(val));
  }
}

export class AnyType extends BaseType {
  static get defaultValue() {
    return null;
  }
  static isOfType(val) {
    return val !== undefined;
  }
}

export function optional(type) {
  return class OptionalType extends coerce(type) {
    static isOfType(val) {
      return super.isOfType(val) || val === undefined || val === null;
    }
    static get defaultValue() {
      return super.definedDefaultValue === undefined ? null : super.defaultValue;
    }
  };
}

export function coerce(type) {
  if (typeof type.isOfType === 'function') {
    if (type.prototype instanceof BaseType) {
      return type;
    } else {
      return class CoercedType extends BaseType {
        static isOfType(val) {
          return type.isOfType(val);
        }
      }
    }
  }

  let derivedType = nativeTypeMap.get(type);

  if (!derivedType) {
    if (Array.isArray(type)) {
      derivedType = nativeTypeMap.get(Array);
      // Arrays of length 1, all items of the array should be of that type
      if (type.length === 1) {
        derivedType = derivedType.ofType(type[0]);
      // Array of greater lengths, type should be a union of all types
      } else if (type.length > 1) {
        derivedType = derivedType.ofType(unionOf(...type));
      }
    } else if (type.constructor === Object) {
      derivedType = nativeTypeMap.get(Object);
      // If there are keys, add a definition to the object
      if (Object.keys(type).length) {
        derivedType = derivedType.withDefinition(type);
      }
    } else {
      derivedType = class InsatanceOfType extends BaseType {
        static isOfType(val) {
          return val instanceof type;
        }
      };
    }
  }

  return derivedType;
}

export function unionOf(...unionTypes) {
  const coercedTypes = unionTypes.map(coerce);
  return class DefinedUnionType extends UnionType {
    static get types() {
      return coercedTypes;
    }
    static get defaultValue() {
      let val = super.defaultValue;
      if (val === undefined) {
        val = this.types.map((t) => t.defaultValue).find((tv) => tv !== undefined);
      }
      return val;
    }
  };
}
