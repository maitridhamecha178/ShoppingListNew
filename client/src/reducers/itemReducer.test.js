import itemReducer from './itemReducer';
import { GET_ITEMS } from '../actions/types';

describe('itemReducer', () => {
  it('normalizes non-array payloads to an empty array', () => {
    const state = itemReducer(undefined, {
      type: GET_ITEMS,
      payload: { message: 'error' }
    });

    expect(state.items).toEqual([]);
  });
});
