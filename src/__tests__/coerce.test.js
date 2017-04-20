import StringType from '../String';
import NumberType from '../Number';
import BooleanType from '../Boolean';
import ArrayType from '../Array';
import ObjectType from '../Object';
import { coerce, UnionType } from '../base';

describe('type coersion', () => {
  describe('Native types', () => {
    test('native String is coerced to defined String', () => {
      expect(coerce(String)).toBe(StringType);
    });
    test('native Number is coerced to defined Number', () => {
      expect(coerce(Number)).toBe(NumberType);
    });
    test('native Boolean is coerced to defined Boolean', () => {
      expect(coerce(Boolean)).toBe(BooleanType);
    });
    test('native Array is coerced to defined array (no type)', () => {
      expect(coerce(Array)).toBe(ArrayType);
    });
    test('native Object is coerced ot defined object (no type)', () => {
      expect(coerce(Object)).toBe(ObjectType);
    })
  });
  describe('Literals', () => {
    test('Array literal ([]) is coerced to defined array (no type)', () => {
      expect(coerce([])).toBe(ArrayType);
    })
    test('Array literal with type ([String] / [StringType]) is coerced to an array of that type', () => {
      const nativeStringArray = coerce([String]);
      const definedNumberArray = coerce([NumberType]);
      expect(nativeStringArray.prototype instanceof ArrayType).toBe(true);
      expect(nativeStringArray.type).toBe(StringType);
      expect(definedNumberArray.prototype instanceof ArrayType).toBe(true);
      expect(definedNumberArray.type).toBe(NumberType);
    });
    test('Array literal with multiple types is coerced to array with a type that is a union of all types listed also coerced', () => {
      const unionArray = coerce([String, NumberType]);
      expect(unionArray.prototype instanceof ArrayType).toBe(true);
      expect(unionArray.type.prototype instanceof UnionType).toBe(true);
      expect(unionArray.type.types).toEqual(expect.arrayContaining([StringType, NumberType]))
    })
    test('Object literal ({}) is coerced to defined object (no type)', () => {
      expect(coerce({})).toBe(ObjectType);
    })
    test('Object literal with props ({foo:String}) is coerced to a defined object with its properties also coerced', () => {
      const coercedObject = coerce({
        foo: String,
        bar: [NumberType, Object],
        baz: {
          test1: String,
          test2: BooleanType,
        }
      })
      expect(coercedObject.prototype instanceof ObjectType);
      expect(coercedObject.properties.foo).toBe(StringType);
      expect(coercedObject.properties.bar.prototype instanceof ArrayType).toBe(true);
      expect(coercedObject.properties.bar.type.prototype instanceof UnionType).toBe(true);
      expect(coercedObject.properties.bar.type.types).toEqual(expect.arrayContaining([NumberType, ObjectType]))
      expect(coercedObject.properties.baz.prototype instanceof ObjectType).toBe(true);
      expect(coercedObject.properties.baz.properties.test1).toBe(StringType);
      expect(coercedObject.properties.baz.properties.test2).toBe(BooleanType);
    });
  });
  describe('classes', () => {
    test('if class defines static isOfType use that classes isOfType', () => {
      class TestClass {
        static isOfType(val) { return true; }
      }
      class TestClass2 {
        static isOfType(val) { return false; }
      }
      expect(coerce(TestClass).isOfType()).toBe(true);
      expect(coerce(TestClass2).isOfType()).toBe(false);
    })
    test('if class doesn\'t define static matches, extended it to add a generic matches for instanceof', () => {
      class TestClass {}
      const coercedClass = coerce(TestClass);
      expect(coercedClass).not.toBe(TestClass);
      expect(coercedClass.isOfType(new TestClass())).toBe(true);
    })
  });
})
