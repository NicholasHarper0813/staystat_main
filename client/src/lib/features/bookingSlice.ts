import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { bookingApi } from "@/lib/api/bookingApi";
import { BookingData } from "@/lib/Types/Dashboard/types";
interface ProductState {
  status: "idle" | "loading";
  bookings: BookingData | any[];
}

const initialState: ProductState = {
  status: "idle",
  bookings: [],
};

export const fetchAllBookingsAsync = createAsyncThunk(
  "bookingsSlice/fetchAllBookings",
  async () => {
    try {
      const response = await bookingApi();
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },
);

export const bookingSlice = createSlice({
  name: "bookingsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder:any) => {
    builder
      .addCase(fetchAllBookingsAsync.pending, (state:any) => {
        state.status = "loading";
      })
      .addCase(fetchAllBookingsAsync.fulfilled, (state:any, action:any) => {
        state.status = "idle";
        state.bookings = action.payload;
      });
  },
});

export const selectAllbookings = (state: any) => state.booking.bookings;

export default bookingSlice.reducer;
