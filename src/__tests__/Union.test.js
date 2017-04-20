import { UnionType, unionOf } from '../base';
import BooleanType from '../Boolean';
import StringType from '../String';
import genericTypeTest from './genericTypeTest'

describe('Union', () => {
  genericTypeTest(UnionType.ofTypes(StringType, BooleanType), {
    "string": true,
    "boolean": true,
  });
})
