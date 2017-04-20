import { UnionType, unionOf } from '../base';
import BooleanType from '../Boolean';
import StringType from '../String';
import genericTypeTest from './genericTypeTest'

describe('Union.ofTypes(...types)', () => {
  genericTypeTest(UnionType.ofTypes(StringType, BooleanType), {
    "string": true,
    "boolean": true,
  });
  describe('.withDefaultValue(val)', () => {
    test('without defined default value, will use default value of first member that has one', () => {
      expect(UnionType.ofTypes(StringType, BooleanType).create()).toBe('');
    });
    test('if a default is defined, it will use that', () => {
      expect(UnionType.ofTypes(StringType, BooleanType).withDefault(true).create()).toBe(true);
    });
  })
})
