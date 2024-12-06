"use client";
import React, { useRef, useState } from "react";
import axios from "@/utils/axios";
import axios_ from "axios";
import validator from "validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { BiError } from "react-icons/bi";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import { FRONTEND_URL } from "@/constants/constant";
import useOrigin from "@/hook/origin/use-origin";
import Credential from "@/components/credential/credential";
import LoginGraphics from "@/components/login/animation/LoginGraphics1";

const AnimatedImage = motion(Image);

const LoginForm = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const origin = useOrigin();
  console.log(origin + "My Website");
  const productionOrigin = "https://www.livebookingsayngo247.com";
  const [loginError, setLoginError] = useState(searchParams.get("error"));
  const [loading, setLoading] = useState(false);
  const [isSignUpPage, setIsSignUpPage] = useState(false);

  const loginHandler = async (event: any) => {
    event.preventDefault();
    // @ts-ignore
    const username = usernameRef.current.value;
    // @ts-ignore
    const password = passwordRef.current.value;
    // console.log('Registering user:', { username, password });
    if (username.trim() == "" || password.trim() == "") {
      toast.error("Username and Password cannot be empty");
      return;
    }
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      toast.error("Password is not strong enough");
      return;
    }
    let url = isSignUpPage ? `/api/signup` : `/api/login`;

    try {
      setLoading(true);

      let { data: ipData } = await axios_.get("https://ipapi.co/json/");
      let ip = ipData.ip;

      const { data: response } = await axios.post(url, {
        username,
        password,
        ip,
      });
      setLoading(false);
      if (response && response.user && response.user?._id) {
        // @ts-ignore
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("authToken", response.jwt);

        if (response.user?.role !== "ADMIN") {
          console.log("redirecting to bookings");
          window.location.href = `/bookings`;
        } else {
          console.log("redirecting to admin");
          window.location.href = `/`;
        }
        // @ts-ignore
        toast.success(`Welcome ${response.user.username}`);
      } else if (response.message) {
        toast.error(response.message);
      }
      setLoading(false);
    } catch (error: any) {
      toast.error("Something went wrong");
      toast.error(error.message);
      setLoading(false);
    }
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fade dark:bg-[#25293c] w-full h-screen flex flex-row items-center justify-center">
      <div className="bg-white hidden xl:flex h-full w-2/3 justify-center items-center pr-16 lg:flex  flex-col z-50 bg-[url('/assets/login_wave.svg')] bg-no-repeat bg-cover">
        <LoginGraphics />
      </div>
      <div className="bg-white  h-full flex items-center justify-center w-full">
        <div className="flex-row h-fit overflow-hidden w-full lg:px-24 items-center ">
          <div className="w-full items-center px-2 lg:border-l-2 border-gray-200 sm:px-6 py-7 flex flex-col bg-white">
            <div className="pb-8 w-full h-full flex flex-col justify-end items-start text-black">
              {origin === productionOrigin ? null : (
                <>
                  <Credential />
                </>
              )}
              <h2 className="text-2xl capitalize mb-2 font-medium">
                {origin === productionOrigin ? (
                  <span className="text-indigo-500 font-semibold">SAYNGO</span>
                ) : (
                  <span className="text-indigo-500 font-semibold">
                    SAYNGO{" "}
                    <span className="text-sm font-light">
                      (staystats development Version)
                    </span>
                  </span>
                )}{" "}
              </h2>
              <p className="text-sm">
                {!isSignUpPage
                  ? "Log in to view Dashboard!"
                  : "Create your account to view Dashboard!"}
              </p>
            </div>
            <div className="w-full flex flex-col">
              <label className="text-sm mb-1 text-gray-700">Username</label>
              <input
                type="text"
                className="auth-input"
                placeholder="Enter your username"
                //@ts-ignore
                ref={usernameRef}
              />

              <label className="text-sm mt-4 mb-1 text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder="Enter your password"
                  //@ts-ignore
                  ref={passwordRef}
                  onFocus={() => setLoginError("")}
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <RiEyeLine size={20} />
                  ) : (
                    <RiEyeCloseLine size={20} />
                  )}
                </div>
              </div>
              {loginError && (
                <div className="flex flex-row items-center mt-2">
                  <BiError className="text-red-500 text-xl" />
                  <span className="text-sm text-red-500 ml-2">
                    {loginError}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center my-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#9a6afd] focus:outline-none rounded-sm accent-indigo-600"
                  />
                  <span className="text-sm text-gray-500 ml-2">
                    Remember me
                  </span>
                </div>
                {!isSignUpPage && (
                  <p
                    className="text-sm text-gray-500 mt-2"
                    onClick={() => {
                      window.open(`${FRONTEND_URL}/forgot-password`, "_blank");
                    }}
                  >
                    <span className="text-indigo-500 cursor-pointer hover:underline ">
                      Forgot Password?
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-row items-center">
                <button
                  onClick={loginHandler}
                  disabled={loading}
                  className="w-full p-2 rounded-md bg-indigo-500 text-white focus:outline-none hover:opacity-90 disabled:opacity-60"
                >
                  {loading && <LoadingSpinner color="#ffff" />}
                  {!loading && (isSignUpPage ? "Sign Up" : "Login")}
                </button>
              </div>
            </div>
            <div
              className="mt-4 cursor-pointer"
              onClick={() => {
                setIsSignUpPage(!isSignUpPage);
              }}
            ></div>
            <div className="flex items-center center my-6">
              <div className="w-full border mr-4 h-fit"></div>
              <span className="text-gray-600 text-xs font-semibold whitespace-nowrap">
                know your business :)
              </span>
              <div className="w-full border ml-4 h-fit"></div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-center" autoClose={10000} />
    </div>
  );
};

export default LoginForm;
