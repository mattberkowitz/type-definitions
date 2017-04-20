import { AnyType } from '../base';
import genericTypeTest, { genericTypeValues } from './genericTypeTest'

describe('Any', () => {
  genericTypeTest(AnyType, Object.keys(genericTypeValues).reduce((o, k) => {
    if (k !== 'null' && k !== 'undefined') {
      o[k] = true;
    }
    return o;
  }, {}));
})
