import * as _ from 'lodash';

describe('noop', () => {
  it('renders without crashing', () => {
    const res = _.add(1, 1);
    expect(res).toEqual(2);
  });
});
