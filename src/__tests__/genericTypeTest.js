export const genericTypeValues = {
  "string": "test",
  "number": 1,
  "boolean": true,
  "array": [],
  "arrayOfStrings": ['test', 'test2'],
  "arrayOfBooleans": [true, false],
  "arrayOfStringsOrNumbers": [1, 'test'],
  "object": {},
  "objectWithStringProp": { "string": "test" },
  "objectWithBooleanProp": { "boolean": true },
  "objectWithStringAndNumberProps": { "string": "test", "number": 1 },
  "keyValueString": { "test": "test", "test2": "test2" },
  "null": null,
  "undefined": undefined
}

export default function genericTypeTest(type, expectMap) {
  function doTests(type, expectMap = {}) {
    const expectedValues = Object.assign(Object.keys(genericTypeValues).reduce((o, k) => {
      o[k] = false;
      return o;
    }, {}), expectMap);
    Object.keys(genericTypeValues).forEach((key) => {
      test(`${expectedValues[key] ? 'matches' : 'does not match'} ${JSON.stringify(genericTypeValues[key])} (${key})`, () => {
        expect(type.isOfType(genericTypeValues[key])).toBe(expectedValues[key]);
      });
    });
    test('create does not return undefined', () => {
      expect(type.create()).not.toBe(undefined);
    });
    describe('.withDefaultValue(val)', () => {
      Object.keys(genericTypeValues).forEach((key) => {
        if (expectedValues[key]) {
          test(`A default value of ${JSON.stringify(genericTypeValues[key])} works`, () => {
            expect(() => type.withDefault(genericTypeValues[key])).not.toThrow();
            expect(type.withDefault(genericTypeValues[key]).create()).toEqual(genericTypeValues[key]);
          });
        } else {
          test(`A default value of ${JSON.stringify(genericTypeValues[key])} throws an error`, () => {
            expect(() => type.withDefault(genericTypeValues[key])).toThrow();
          });
        }
      });
    });
  }

  doTests(type, expectMap);

  describe('.optional', () => {
    doTests(type.optional, Object.assign(expectMap, { 'null': true, 'undefined': true }));
  })
}
