"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { HotelData } from "@/lib/Types/Dashboard/types";

import {
  fetchAllHotelsAsync,
  selectAllhotels,
} from "@/lib/features/hotelSlice";

const HotelProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch: AppDispatch = useDispatch();
  const HotelData: HotelData[] = useSelector(selectAllhotels);
  useEffect(() => {
    if (HotelData) {
      dispatch(fetchAllHotelsAsync());
    }
  }, []);

  return <>{children}</>;
};

export default HotelProvider;
