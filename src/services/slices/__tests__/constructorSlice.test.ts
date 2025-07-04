import constructorReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 0,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  const mockFilling: TIngredient = {
    ...mockIngredient,
    _id: '2',
    name: 'Начинка',
    type: 'main'
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('должен обрабатывать добавление булки', () => {
    const action = addIngredient(mockIngredient);
    const result = constructorReducer(initialState, action);

    expect(result.bun).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  it('должен обрабатывать добавление начинки', () => {
    const action = addIngredient(mockFilling);
    const result = constructorReducer(initialState, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual({
      ...mockFilling,
      id: expect.any(String)
    });
  });

  it('должен обрабатывать удаление ингредиента', () => {
    const addAction = addIngredient(mockFilling);
    const stateWithIngredient = constructorReducer(initialState, addAction);
    const ingredientId = stateWithIngredient.ingredients[0].id;

    const removeAction = removeIngredient(ingredientId);
    const result = constructorReducer(stateWithIngredient, removeAction);

    expect(result.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать перемещение ингредиентов', () => {
    const firstFilling = { ...mockFilling, _id: '2' };
    const secondFilling = { ...mockFilling, _id: '3' };

    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...firstFilling, id: '1' },
        { ...secondFilling, id: '2' }
      ]
    };

    const moveAction = moveIngredient({ from: 0, to: 1 });
    const result = constructorReducer(stateWithIngredients, moveAction);

    expect(result.ingredients[0]._id).toBe('3');
    expect(result.ingredients[1]._id).toBe('2');
  });

  it('должен очищать конструктор', () => {
    const stateWithItems = {
      bun: { ...mockIngredient, id: '1' },
      ingredients: [{ ...mockFilling, id: '2' }]
    };

    const result = constructorReducer(stateWithItems, clearConstructor());
    expect(result).toEqual(initialState);
  });
});