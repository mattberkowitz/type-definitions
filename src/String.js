import { BaseType } from './base';
import nativeTypeMap from './nativeTypeMap';

export default class StringType extends BaseType {
  static isOfType(val) {
    return typeof val === 'string';
  }
}

nativeTypeMap.set(String, StringType);
