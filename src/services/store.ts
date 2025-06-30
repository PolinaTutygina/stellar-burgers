import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user'; // правильный путь для userSlice

const store = configureStore({
  reducer: {
    user: userReducer // подключаем редьюсер для пользователя
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
