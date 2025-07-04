import feedReducer, { initialState, fetchFeeds, fetchUserOrders } from '../feedSlice';
import { TOrder, TOrdersData } from '@utils-types';

describe('feedSlice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['60d3b41abdacab0026a733c6'],
    status: 'done',
    name: 'Space флюоресцентный бургер',
    number: 1234,
    createdAt: '2021-06-23T14:43:22.587Z',
    updatedAt: '2021-06-23T14:43:22.587Z'
  };

  const mockFeeds: TOrdersData = {
    orders: [mockOrder],
    total: 100,
    totalToday: 10
  };

  it('должен возвращать начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('fetchFeeds', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeeds
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orders: mockFeeds.orders,
        total: mockFeeds.total,
        totalToday: mockFeeds.totalToday,
        loading: false
      });
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Ошибка загрузки ленты';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        error: errorMessage,
        loading: false
      });
    });

    it('должен обрабатывать rejected состояние без message', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        error: {}
      };
      const state = feedReducer(initialState, action);

      expect(state.error).toBe('Ошибка загрузки ленты');
    });
  });

  describe('fetchUserOrders', () => {
    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: [mockOrder]
      };
      const state = feedReducer(initialState, action);

      expect(state.orders).toEqual([mockOrder]);
    });

    it('не должен изменять loading при fulfilled', () => {
      const loadingState = { ...initialState, loading: true };
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: [mockOrder]
      };
      const state = feedReducer(loadingState, action);

      expect(state.loading).toBe(true);
    });
  });
});