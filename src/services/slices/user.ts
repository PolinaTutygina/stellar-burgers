import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuth: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isAuth: false
};

// Thunk для проверки авторизации
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuth = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
        state.isAuth = false;
      });
  }
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
