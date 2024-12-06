import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { hotelApi } from "@/lib/api/hotelApi";
interface ProductState {
    status: "idle" | "loading";
    hotels: any[];
}

const initialState: ProductState = {
    status: "idle",
    hotels: [],
}

export const fetchAllHotelsAsync = createAsyncThunk(
    "hotel/fetchAllhotelss",
    async () => {
        try {
            const response = await hotelApi();
            return response.data;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            throw error; // Rethrow the error for the component to handle
        }
    }
);


export const hotelSlice = createSlice({
    name: "hotel",
    initialState,
    reducers: {
    },
    extraReducers: (builder:any) => {
        builder
            .addCase(fetchAllHotelsAsync.pending, (state:any) => {
                state.status = "loading";
            })
            .addCase(fetchAllHotelsAsync.fulfilled, (state:any, action:any) => {
                state.status = "idle";
                state.hotels = action.payload;
            })
    },
});
export const selectAllhotels = (state: any) => state.hotel.hotels;

export default hotelSlice.reducer;