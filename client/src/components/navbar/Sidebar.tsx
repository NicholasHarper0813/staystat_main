"use client";
import Link from "next/link";
import React, { useDeferredValue, useEffect } from "react";
import { useState } from "react";
import { FaHome, FaRocket, FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
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
import { fetchOwner } from "@/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { FRONTEND_URL } from "@/constants/constant";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  let router = useRouter();
  const [owner, setOwner] = useState<any>({});
  const [accountType, setAccountType] = useState<string>("");
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(isSidebarOpen);
  const [hover, setHover] = useState(false);
  console.log(isNavOpen);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
    let updateUser = async () => {
      const user = await fetchOwner(userId);
      if (user && user._id && user.isActive) {
        setOwner(user);
        localStorage.setItem("user", JSON.stringify(user));
        setAccountType(user?.role);
      } else {
        toast.error("You are not authorized to view this page");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");

        window.open(`${FRONTEND_URL}/login`, "_self");
      }
    };
    updateUser();
  }, []);

  useEffect(() => {
    setIsNavOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  const navHoverEffectEnter = () => {
    if (isSidebarOpen) {
      return;
    }
    setHover(true);
  };

  const navHoverEffectOut = () => {
    setHover(false);
  };

  return (
    <motion.nav
      initial={{ width: 0 }}
      animate={{ width: !isNavOpen ? "220px" : "auto" }}
      transition={{ duration: 0.3 }}
      // onMouseEnter={navHoverEffectEnter}
      // onMouseLeave={navHoverEffectOut}
      className={`overflow-hidden h-screen ${
        isNavOpen ? "w-auto fixed lg:relative" : "w-[220px] fixed lg:relative z-20"
      } bg-white dark:bg-[#282f46] border border-r dark:border-gray-300/25 border-gray-600/25 pt-4`}
    >
      <div className="flex flex-col items-center justify-between h-screen w-full">
        <ul
          className={`${
            !isNavOpen ? "flex" : "hidden"
          } w-full px-2 lg:flex flex-col gap-4 font-semibold`}
        >
          {
            accountType === "ADMIN" ? (
              <>
           <Link href="/dash">
            <li
                className={` flex items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                    pathname === "/dash" || pathname === "/"
                        ? "bg-slate-300 dark:bg-slate-700 text-primary hover:none"
                        : " dark:hover:bg-slate-600"
                } rounded-md`}
            >
              <MdDashboard size={20} />{" "}
              <p className={` text-sm ${isNavOpen && "hidden"}`}>Dashboard</p>
            </li>
          </Link>
          </>
            ) : null}


          <Link href="/users">
            <li
              className={`${
                accountType === "SUBADMIN" && "hidden"
              } flex items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                pathname === "/users"
                    ? "bg-slate-300 dark:bg-slate-700 text-primary hover:none"
                    : " dark:hover:bg-slate-600"
              } rounded-md`}
            >
              <HiUserGroup size={20} />{" "}
              <p className={` text-sm ${isNavOpen && "hidden"}`}>Users</p>
            </li>
          </Link>
          <Link href="/hotels">
            <li
              className={`${
                accountType === "SUBADMIN" && "hidden"
              } flex items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                pathname === "/hotels"
                    ? "bg-slate-300 dark:bg-slate-700 text-primary hover:none"
                    : " dark:hover:bg-slate-600"
              } rounded-md`}
            >
              <FaHome size={20} />
              <p className={` text-sm ${isNavOpen && "hidden"}`}>Hotels</p>
            </li>
          </Link>
          <Link href="/bookings">
            <li
              className={`flex text-center items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                pathname === "/bookings"
                    ? "bg-slate-300 dark:bg-slate-700 text-primary hover:none"
                    : " dark:hover:bg-slate-600"
              } rounded-md`}
            >
              <RiMailFill size={20} />{" "}
              <p className={` text-sm ${isNavOpen && "hidden"}`}>Bookings</p>
            </li>
          </Link>
          <Link href="/leads">
            <li
              className={`flex text-center items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                pathname === "/leads"
                    ? "bg-slate-300 dark:bg-slate-700 text-primary hover:none"
                    : " dark:hover:bg-slate-600"
              } rounded-md`}
            >
              <MdLeaderboard size={20} />{" "}
              <p
                className={` text-sm whitespace-nowrap ${
                  isNavOpen && "hidden"
                }`}
              >
                Lead Generator
              </p>
            </li>
          </Link>
          <Link href="/works">
            <li
              className={`flex text-center items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                pathname === "/works"
                    ? "bg-slate-300 dark:bg-slate-700 text-primary hover:none"
                    : " dark:hover:bg-slate-600"
              } rounded-md`}
            >
              <MdWorkHistory size={20} />{" "}
              <p className={` text-sm ${isNavOpen && "hidden"}`}>Log Book</p>
            </li>
          </Link>
          <Link href="/users-ip">
            <li
              className={`${
                accountType === "SUBADMIN" && "hidden"
              } flex items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                pathname === "/users-ip"
                    ? "bg-slate-300 dark:bg-slate-700 text-primary hover:none"
                    : " dark:hover:bg-slate-600"
              } rounded-md`}
            >
              <FaAddressBook size={20} />{" "}
              <p className={` text-sm ${isNavOpen && "hidden"}`}>Users Ip</p>
            </li>
          </Link>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Sidebar;
