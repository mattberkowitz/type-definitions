import { BaseType } from './base';
import nativeTypeMap from './nativeTypeMap';

export default class NumberType extends BaseType {
  static isOfType(val) {
    return typeof val === 'number';
  }
  static get defaultValue() {
    return 0;
  }
}

nativeTypeMap.set(Number, NumberType);
