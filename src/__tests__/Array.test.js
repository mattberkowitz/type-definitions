import ArrayType from '../Array';
import StringType from '../String';
import NumberType from '../Number';
import genericTypeTest from './genericTypeTest'

describe('Array', () => {
  genericTypeTest(ArrayType, {
    "array": true,
    "arrayOfStrings": true,
    "arrayOfBooleans": true,
    "arrayOfStringsOrNumbers": true
  });

  describe('.ofType', () => {
    genericTypeTest(ArrayType.ofType(String), {
      "array": true,
      "arrayOfStrings": true,
    })
  })

  describe('.ofType (multiple)', () => {
    genericTypeTest(ArrayType.ofType(String, Number), {
      "array": true,
      "arrayOfStrings": true,
      "arrayOfStringsOrNumbers": true,
    })
  })
})
