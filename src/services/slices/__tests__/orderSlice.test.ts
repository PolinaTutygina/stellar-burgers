import orderReducer, {
  initialState,
  createOrder,
  fetchOrderByNumber,
  clearOrder,
  setOrderModalData,
  clearOrderModalData
} from '../orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['60d3b41abdacab0026a733c6'],
    status: 'done',
    name: 'Бургер',
    number: 1234,
    createdAt: '2025-06-23T14:43:22.587Z',
    updatedAt: '2025-06-23T14:43:22.587Z'
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('createOrder', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orderRequest: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        order: mockOrder,
        orderModalData: mockOrder,
        orderRequest: false
      });
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        error: errorMessage,
        orderRequest: false
      });
    });
  });

  describe('fetchOrderByNumber', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orderModalData: mockOrder,
        orderRequest: false
      });
    });

    it('должен обрабатывать rejected состояние', () => {
      const errorMessage = 'Ошибка загрузки заказа';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        error: errorMessage,
        orderRequest: false
      });
    });
  });

  describe('синхронные экшены', () => {
    it('должен очищать заказ', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderModalData: mockOrder
      };
      const state = orderReducer(stateWithOrder, clearOrder());

      expect(state).toEqual({
        ...stateWithOrder,
        order: null,
        orderModalData: null,
        error: null
      });
    });

    it('должен устанавливать данные модального окна', () => {
      const action = setOrderModalData(mockOrder);
      const state = orderReducer(initialState, action);

      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('должен очищать данные модального окна', () => {
      const stateWithModal = {
        ...initialState,
        orderModalData: mockOrder
      };
      const state = orderReducer(stateWithModal, clearOrderModalData());

      expect(state.orderModalData).toBeNull();
    });
  });
});