import { configureStore } from '@reduxjs/toolkit';
import itineraryReducer from './slices/itinerarySlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    itinerary: itineraryReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
