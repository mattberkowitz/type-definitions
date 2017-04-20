import NumberType from '../Number';
import genericTypeTest from './genericTypeTest'

describe('Number', () => {
  genericTypeTest(NumberType, {
    "number": true,
  });
})
