"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { UserData } from "@/lib/Types/Dashboard/types";
import { fetchAllUsersAsync, selectAllUsers } from "@/lib/features/userSlice";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch: AppDispatch = useDispatch();
  const UserData: UserData[] = useSelector(selectAllUsers);
  useEffect(() => {
    if (UserData) {
      dispatch(fetchAllUsersAsync());
    }
  }, []);

  return <>{children}</>;
};

export default UserProvider;
