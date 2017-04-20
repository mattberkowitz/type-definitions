import { BaseType, coerce, unionOf } from './base';
import nativeTypeMap from './nativeTypeMap';

export default class ArrayType extends BaseType {
  static isOfType(val) {
    return Array.isArray(val);
  }

  static get defaultValue() {
    return [];
  }

  static ofType(...memberType) {
    const coercedType = memberType.length === 1 ?
      coerce(memberType[0]) :
      unionOf(...memberType);
    return class ArrayOfType extends this {
      static get type() {
        return coercedType;
      }
      static isOfType(val) {
        return super.isOfType(val) && val.every((itemVal) => this.type.isOfType(itemVal));
      }
    };
  }
}

nativeTypeMap.set(Array, ArrayType);
