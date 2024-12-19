"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/navbar/Sidebar";
import LoginForm from "@/components/login";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import MobileBottomNavbar from "@/components/navbar/MobileSidebar";
import ForgotPasswordRequest from "@/components/ForgotPasswordRequest";
import ResetPasswordForm from "@/components/ResetPasswordComponent";
import { usePathname, useRouter } from "next/navigation";
import { FRONTEND_URL } from "@/constants/constant";

type Props = {};

const DefaultLayout = ({ children }: any) => {
  let router = useRouter();
  let pathName = usePathname();
  let [user, setUser] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) {}
    if (user && user._id && user.isActive) 
    {
      setUser(user);
      setLoading(false);
    }
    else
    {
      setLoading(false);
    }
  }, []);
  if (loading)
  {
    return <LoadingSpinner />;
  }
  
  console.log("pathName", pathName);

  return (
    <div className="overflow-hidden">
      {user && user._id && user.isActive ? (
        <div className="overflow-hidden max-h-screen ">
          <div className=" lg:block">
            <Navbar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </div>
          <div className="flex">
            <div className="lg:flex z-50">
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
            </div>
            <div className="lg:m-6 lg:px-4 max-h-[90vh] lg:max-h-[90vh] w-full overflow-y-scroll">
              {children}
            </div>
          </div>
        </div>
      ) : pathName === "/forgot-password" ? (
        <ForgotPasswordRequest />
      ) : pathName === "/reset-password" ? (
        <ResetPasswordForm />
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default DefaultLayout;
