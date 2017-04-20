import {
  BaseType,
  UnionType,
  AnyType,

  coerce,
  unionOf,
  optional
} from './base';

import ArrayType from './Array';
import BooleanType from './Boolean';
import NumberType from './Number';
import ObjectType, { strict } from './Object';
import StringType from './String';

const types = {
  Base: BaseType,
  Union: UnionType,
  Any: AnyType,
  Object: ObjectType,
  Array: ArrayType,
  String: StringType,
  Number: NumberType,
  Boolean: BooleanType
};

export {
  coerce as defineType,
  unionOf,
  optional,
  strict,
  types
}
