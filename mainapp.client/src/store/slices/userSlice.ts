import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  currentUser: User | null;
  bookmarks: string[];
  travelHistory: string[];
}

const initialState: UserState = {
  currentUser: null,
  bookmarks: [],
  travelHistory: [],
};

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
});

export const { setUser, addBookmark, removeBookmark, addToHistory, logout } = userSlice.actions;
export default userSlice.reducer; 