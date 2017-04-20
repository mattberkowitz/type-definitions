import BooleanType from '../Boolean';
import genericTypeTest from './genericTypeTest'

describe('Boolean', () => {
  genericTypeTest(BooleanType, {
    "boolean": true,
  });
})
