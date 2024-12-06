"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { BookingData } from "@/lib/Types/Dashboard/types";
import {
  fetchAllBookingsAsync,
  selectAllbookings,
} from "@/lib/features/bookingSlice";

const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch: AppDispatch = useDispatch();
  const bookingData: BookingData[] = useSelector(selectAllbookings);
  useEffect(() => {
    if (bookingData) {
      dispatch(fetchAllBookingsAsync());
    }
  }, []);

  return <>{children}</>;
};

export default BookingProvider;
