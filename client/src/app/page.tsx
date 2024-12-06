import Dashboard from "@/components/dash/Dashboard";
import React from "react";
import AdminProtector from "@/Protector/Admin";
import HotelProvider from "@/components/dash/Provider/Hotel/HotelProvider";
import UserProvider from "@/components/dash/Provider/User/UserProvider";
import BookingProvider from "@/components/dash/Provider/Booking/BookingProvider";

export default function Home() {
  return (
    <div>
      <AdminProtector>
        <HotelProvider>
          <UserProvider>
            <BookingProvider>
              <Dashboard />
            </BookingProvider>
          </UserProvider>
        </HotelProvider>
      </AdminProtector>
    </div>
  );
}
