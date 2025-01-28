import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight, Accommodation, Activity } from '../../types';

interface ItineraryState {
  flight: Flight | null;
  accommodation: Accommodation | null;
  activities: Activity[];
  startDate: string | null;
  endDate: string | null;
}

const initialState: ItineraryState = {
  flight: null,
  accommodation: null,
  activities: [],
  startDate: null,
  endDate: null,
};

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    setFlight: (state, action: PayloadAction<Flight>) => {
      state.flight = action.payload;
    },
    setAccommodation: (state, action: PayloadAction<Accommodation>) => {
      state.accommodation = action.payload;
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.push(action.payload);
    },
    removeActivity: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter(activity => activity.id !== action.payload);
    },
    setDates: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setFlight, setAccommodation, addActivity, removeActivity, setDates } = itinerarySlice.actions;
export default itinerarySlice.reducer; 