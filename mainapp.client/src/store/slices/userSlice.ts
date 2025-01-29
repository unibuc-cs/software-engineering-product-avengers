import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { logIn } from '../../api';

interface UserState {
  currentUser: User | null;
  bookmarks: string[];
  travelHistory: string[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  bookmarks: [],
  travelHistory: [],
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const response = await logIn(credentials);
    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    addBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks.push(action.payload);
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(id => id !== action.payload);
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      state.travelHistory.push(action.payload);
    },
    logout: (state) => {
      state.currentUser = null;
      state.bookmarks = [];
      state.travelHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { setUser, addBookmark, removeBookmark, addToHistory, logout } = userSlice.actions;
export default userSlice.reducer; 