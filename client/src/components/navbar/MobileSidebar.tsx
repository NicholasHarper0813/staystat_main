"use client";
import Link from "next/link";
import React, { useDeferredValue, useEffect } from "react";
import { useState } from "react";
import { FaRocket, FaBars } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { RiMailFill, RiSettings5Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { FaRegCircle, FaRegDotCircle, FaAddressBook } from "react-icons/fa";
import {
  MdDashboard,
  MdLeaderboard,
  MdWorkOutline,
  MdWorkHistory,
} from "react-icons/md";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";

const MobileBottomNavbar = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="z-50 fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-300 h-16 px-4 gap-2">
      <Link
        href="/"
        onClick={() => handleTabChange("/")}
        className={`flex flex-col items-center text-sm ${
          activeTab === "/"
            ? "text-blue-500 bg-gray-200 p-1 rounded-lg"
            : "text-gray-500"
        }`}
      >
        <MdDashboard className="text-xl" />
        <span className="mt-1">Dasboard</span>
      </Link>
      <Link
        href="/users"
        onClick={() => handleTabChange("users")}
        className={`flex flex-col items-center text-sm ${
          activeTab === "users"
            ? "text-blue-500 bg-gray-200 p-1 rounded-lg"
            : "text-gray-500"
        }`}
      >
        <FaUser className="text-xl" />
        <span className="mt-1">Users</span>
      </Link>
      <Link
        href="/hotels"
        onClick={() => handleTabChange("hotels")}
        className={`flex flex-col items-center text-sm ${
          activeTab === "hotels"
            ? "text-blue-500 bg-gray-200 p-1 rounded-lg"
            : "text-gray-500"
        }`}
      >
        <FaHome className="text-xl" />
        <span className="mt-1">Hotels</span>
      </Link>
      <Link
        href="/bookings"
        onClick={() => handleTabChange("bookings")}
        className={`flex flex-col items-center text-sm ${
          activeTab === "bookings"
            ? "text-blue-500 bg-gray-200 p-1 rounded-lg"
            : "text-gray-500"
        }`}
      >
        <RiMailFill className="text-xl" />
        <span className="mt-1">Bookings</span>
      </Link>
      <Link
        href="/leads"
        onClick={() => handleTabChange("leads")}
        className={`flex flex-col items-center text-sm ${
          activeTab === "leads"
            ? "text-blue-500 bg-gray-200 p-1 rounded-lg"
            : "text-gray-500"
        }`}
      >
        <MdLeaderboard className="text-xl" />
        <span className="mt-1">Lead</span>
      </Link>
      <Link
        href="/works"
        onClick={() => handleTabChange("works")}
        className={`flex flex-col items-center text-sm ${
          activeTab === "works"
            ? "text-blue-500 bg-gray-200 p-1 rounded-lg"
            : "text-gray-500"
        }`}
      >
        <MdWorkHistory className="text-xl" />
        <span className="mt-1">Works</span>
      </Link>
      <Link
        href="/users-ip"
        onClick={() => handleTabChange("IP")}
        className={`flex flex-col items-center text-sm ${
          activeTab === "IP"
            ? "text-blue-500 bg-gray-200 p-1 rounded-lg"
            : "text-gray-500"
        }`}
      >
        <FaAddressBook className="text-xl" />
        <span className="mt-1">IP</span>
      </Link>
    </div>
  );
};

export default MobileBottomNavbar;
