"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { RiMenu2Fill, RiMenuUnfoldFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import Switcher from "../mode/Switcher";
import { ThemeProvider } from "next-themes";
// import Breadcrumbs from "./Breadcrumbs";
import profileImage from "../../../public/assets/avatar01.png";
import axios from "@/utils/axios";
import axios_ from "axios";

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}
//❌
const events: any = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];
const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);
  const [pathName, setPathName] = useState("");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user") || "");
    setUser(user);
  }, []);

  const profileDropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsProfileDropDownOpen(!isProfileDropDownOpen);
  };

  const logoutHandler = async () => {
    let { data: ipData } = await axios_.get("https://ipapi.co/json/");
    let ip = ipData.ip;
    await axios.post("/api/logout", {
      id: user._id,
      ip,
      action: "MANNUAL LOGOUT",
    });
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const pathname = usePathname();

  useEffect(() => {
    setPathName(pathname);
  }, [setPathName, pathname]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        profileDropdownRef.current &&
        // @ts-ignore
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropDownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  let timer: number;
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };
  //❌
  const handleLogoutTimer = () => {
    //@ts-ignore
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item): any => {
        // @ts-ignore
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logoutAction("INACTIVITY LOGOUT");
    }, 500000); // 10000ms = 10secs.
  };
  useEffect(() => {
    Object.values(events).forEach((item) => {
      // @ts-ignore
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  }, []);

  const logoutAction = async (action: string) => {
    let { data: ipData } = await axios_.get("https://ipapi.co/json/");
    let ip = ipData.ip;
    let userId = JSON.parse(localStorage.getItem("user") || "")?._id;
    await axios.post("/api/logout", {
      id: userId,
      ip,
      action,
    });
    localStorage.clear();
    window.location.pathname = "/";
  };

  return (
    <div className="flex w-full z-50 bg-white dark:bg-[#282f46] flex-col gap-2 cursor-pointer text-gray-600 border-sm border border-b dark:border-gray-300/25 border-gray-600/25">
      <div className="navbar flex justify-between items-center px-4 py-4 bg-white dark:bg-[#282f46] rounded-lg">
        <div className="flex items-center justify-center gap-6">
          <div className="w-full flex items-center justify-between gap-2 font-semibold text-blue-500 ">
            <div className="flex gap-2 items-center justify-center">
              <div>
                <RiMenu2Fill
                  size={25}
                  className={`hover:cursor-pointer`}
                  onClick={() => {
                    toggleSidebar();
                  }}
                />
              </div>
              <Image
                src="/assets/sayngo.png"
                width={30}
                height={20}
                alt=""
              ></Image>

              <span className={` lg:text-xl lg:block hidden lg:font-bold`}>
                SAYNGO
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="mt-2">
            <div className="hidden lg:block">
              <RiMenuUnfoldFill
                size={18}
                onClick={() => {
                  toggleSidebar();
                }}
                className={`block lg:hidden`}
              />
            </div>
            <ThemeProvider>
              <Switcher />
            </ThemeProvider>
          </div>
          {/* <BsHouseCheck size={18} />
          <BsBarChart size={18} />
          <div className="relative">
            <span className="absolute rounded-full h-3 w-3 bg-blue-500 border-2 border-white -top-2 -right-1"></span>
            <BsBell size={18} />
          </div> */}
          <div className="relative" ref={profileDropdownRef}>
            <span className="absolute rounded-full h-3 w-3 bg-green-500 border-2 border-white right-0 bottom-0"></span>
            <Image
              src={profileImage}
              height={35}
              width={35}
              alt="Image"
              className="border-gray-300 rounded-full border-2"
              onClick={() => {
                toggleDropdown();
              }}
            />

            {isProfileDropDownOpen && (
              <motion.div
                initial={{ x: 20, y: -10, scale: 0.8 }}
                animate={{ x: 0, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg py-2 w-[300px] z-50"
              >
                <div className="flex items-center gap-4 px-4 py-2">
                  <Image
                    src={profileImage}
                    height={35}
                    width={35}
                    alt="Image"
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {user.username || "user"}
                    </p>
                    <p className="text-gray-500 text-xs lowercase ">
                      {user.role || "user"}
                    </p>
                  </div>
                </div>
                <hr className="border-gray-300" />
                <div
                  onClick={logoutHandler}
                  className="px-4 py-2 text-sm hover:text-red-700 flex items-center gap-2 text-gray-600"
                >
                  <MdLogout size={20} className="inline-block mr-2" />
                  Logout
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
