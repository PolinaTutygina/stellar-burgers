import userReducer, {
  initialState,
  getUser,
  setAuthChecked,
  clearUserErrors,
  setUser,
  setAuthenticated
} from '../userSlice';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test'
  };

  describe('getUser', () => {
    it('должен обрабатывать fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        isAuthChecked: true
      });
    });

    it('должен обрабатывать rejected', () => {
      const action = { type: getUser.rejected.type };
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('actions', () => {
    it('должен устанавливать флаг проверки аутентификации', () => {
      const action = setAuthChecked(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    it('должен очищать ошибки пользователя', () => {
      const stateWithErrors = {
        ...initialState,
        loginUserError: 'Ошибка',
        registerUserError: 'Ошибка'
      };
      const state = userReducer(stateWithErrors, clearUserErrors());

      expect(state.loginUserError).toBeNull();
      expect(state.registerUserError).toBeNull();
    });

    it('должен устанавливать пользователя', () => {
      const action = setUser(mockUser);
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    it('должен устанавливать флаг аутентификации', () => {
      const action = setAuthenticated(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthenticated).toBe(true);
    });
  });
});