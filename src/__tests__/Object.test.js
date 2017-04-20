import ObjectType from '../Object';
import StringType from '../String';
import NumberType from '../Number';
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
  })

  describe('.withDefinition().strict', () => {
    genericTypeTest(ObjectType.withDefinition({ "string": StringType }).strict, {
      "objectWithStringProp": true,
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
