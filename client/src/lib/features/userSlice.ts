import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "@/lib/api/userApi";

interface usersState {
    status: "idle" | "loading";
    users: any[];
}

const initialState: usersState = {
    status: "idle",
    users: [],
}

export const fetchAllUsersAsync = createAsyncThunk(
    "userSlice/fetchAllUsers",
    async () => {
        try {
            const response = await userApi();
            return response.data;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            throw error;
        }
    }

);

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsersAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllUsersAsync.fulfilled, (state:any, action:any) => {
                state.status = "idle";
                state.users = action.payload;
            });
    },
});

export const selectAllUsers = (state:any) => state.user.users;

export default userSlice.reducer;
