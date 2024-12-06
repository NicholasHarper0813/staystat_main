import { configureStore } from "@reduxjs/toolkit";
import bookingsReducer from "@/lib/features/bookingSlice";
import hotelsReducer from "@/lib/features/hotelSlice";
import usersReducer from "@/lib/features/userSlice";

export const store = configureStore({
  reducer: {
    booking: bookingsReducer,
    hotel: hotelsReducer,
    user: usersReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
