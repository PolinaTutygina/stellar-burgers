import { rootReducer } from './store';
import { initialState as constructorInitialState } from './slices/constructorSlice';
import { initialState as ingredientsInitialState } from './slices/ingredientsSlice';
import { initialState as orderInitialState } from './slices/orderSlice';
import { initialState as userInitialState } from './slices/userSlice';
import { initialState as feedInitialState } from './slices/feedSlice';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние', () => {
    const expectedInitialState = {
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      order: orderInitialState,
      user: userInitialState,
      feed: feedInitialState
    };

    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(expectedInitialState);
  });

  it('должен сохранять ссылочную неизменяемость при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const result = rootReducer(initialState, { type: 'ANOTHER_UNKNOWN_ACTION' });
    expect(result).toBe(initialState);
  });

  it('должен содержать все необходимые ветви состояния', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
  });
});