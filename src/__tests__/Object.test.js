import ObjectType from '../Object';
import StringType from '../String';
import BooleanType from '../Boolean';
import NumberType from '../Number';
import ArrayType from '../Array';
import genericTypeTest from './genericTypeTest'

describe('Object', () => {
  genericTypeTest(ObjectType, {
    "object": true,
    "objectWithStringProp": true,
    "objectWithStringAndNumberProps": true,
    "objectWithBooleanProp": true,
    "keyValueString": true,
  });

  describe('.withDefinition', () => {
    genericTypeTest(ObjectType.withDefinition({ "string": StringType }), {
      "objectWithStringProp": true,
      "objectWithStringAndNumberProps": true,
    });
    describe('.create', () => {
      test('providing nothing, .create() will use defaults of children', () => {
        expect(ObjectType.withDefinition({
          a: StringType,
          b: NumberType,
          c: {
            d: ArrayType,
            e: BooleanType.withDefault(true)
          },
          f: StringType.optional
        }).create()).toEqual({
          a: '',
          b: 0,
          c: {
            d: [],
            e: true
          },
          f: null
        });
      })
      test('prividing a definition will use those values and defaults where values are not provided', () => {
        expect(ObjectType.withDefinition({
          a: StringType,
          b: NumberType,
          c: {
            d: ArrayType,
            e: BooleanType.withDefault(true)
          },
          f: StringType.optional
        }).create({ c: { e: false }, f: 'test' })).toEqual({
          a: '',
          b: 0,
          c: {
            d: [],
            e: false
          },
          f: 'test'
        });
      })
      test('additional, undefined, properties passed to create will be maintained', () => {
        expect(ObjectType.withDefinition({
          a: StringType,
          b: NumberType,
          c: {
            d: ArrayType,
            e: BooleanType.withDefault(true)
          },
          f: StringType.optional
        }).create({ c: { e: false }, f: 'test', g: 'hi' })).toEqual({
          a: '',
          b: 0,
          c: {
            d: [],
            e: false
          },
          f: 'test',
          g: 'hi'
        });
      });
    })
  })

  describe('.withDefinition().strict', () => {
    genericTypeTest(ObjectType.withDefinition({ "string": StringType }).strict, {
      "objectWithStringProp": true,
    });
    describe('.create', () => {
      test('providing nothing, .create() will use defaults of children', () => {
        expect(ObjectType.withDefinition({
          a: StringType,
          b: NumberType,
          c: {
            d: ArrayType,
            e: BooleanType.withDefault(true)
          },
          f: StringType.optional
        }).strict.create()).toEqual({
          a: '',
          b: 0,
          c: {
            d: [],
            e: true
          },
          f: null
        });
      })
      test('prividing a definition will use those values and defaults where values are not provided', () => {
        expect(ObjectType.withDefinition({
          a: StringType,
          b: NumberType,
          c: {
            d: ArrayType,
            e: BooleanType.withDefault(true)
          },
          f: StringType.optional
        }).strict.create({ c: { e: false }, f: 'test' })).toEqual({
          a: '',
          b: 0,
          c: {
            d: [],
            e: false
          },
          f: 'test'
        });
      })
      test('additional, undefined, properties passed to create will NOT be maintained', () => {
        expect(ObjectType.withDefinition({
          a: StringType,
          b: NumberType,
          c: {
            d: ArrayType,
            e: BooleanType.withDefault(true)
          },
          f: StringType.optional
        }).strict.create({ c: { e: false }, f: 'test', g: 'hi' })).toEqual({
          a: '',
          b: 0,
          c: {
            d: [],
            e: false
          },
          f: 'test'
        });
      });
    });
  })

  describe('.withDefinition (optional prop)', () => {
    genericTypeTest(ObjectType.withDefinition({ "string": StringType, "number": NumberType.optional }), {
      "objectWithStringProp": true,
      "objectWithStringAndNumberProps": true,
    });
  })

  describe('.keyValuePair', () => {
    genericTypeTest(ObjectType.keyValuePair(StringType), {
      "object": true,
      "objectWithStringProp": true,
      "keyValueString": true,
    });
  })
})
