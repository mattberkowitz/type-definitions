import StringType from '../String';
import genericTypeTest from './genericTypeTest'

describe('String', () => {
  genericTypeTest(StringType, {
    "string": true,
  });
})
