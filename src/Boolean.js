import { BaseType } from './base';
import nativeTypeMap from './nativeTypeMap';

export default class BooleanType extends BaseType {
  static isOfType(val) {
    return typeof val === 'boolean';
  }
  static get defaultValue() {
    return false;
  }
}

nativeTypeMap.set(Boolean, BooleanType);
