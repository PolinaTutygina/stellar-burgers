import ingredientsReducer, {
  initialState,
  fetchIngredients
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredient: TIngredient = {
    _id: '60d3b41abdacab0026a733c6',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: '',
    image_large: ''
  };

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: [mockIngredient]
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        ingredients: [mockIngredient],
        loading: false
      });
    });

    it('должен обрабатывать rejected состояние с сообщением об ошибке', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        error: errorMessage,
        loading: false
      });
    });

    it('должен обрабатывать rejected состояние без сообщения об ошибке', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        error: 'Ошибка загрузки ингредиентов',
        loading: false
      });
    });

    it('не должен изменять ingredients при rejected', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient]
      };
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Error' }
      };
      const state = ingredientsReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual([mockIngredient]);
    });
  });
});