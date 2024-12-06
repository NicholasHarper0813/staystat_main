"use client";
import React, { useRef, useState, useEffect } from "react";
import axios from "@/utils/axios";
import validator from "validator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { MdOutlineDoneAll } from "react-icons/md";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";
import { BiError } from "react-icons/bi";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import { BASE_URL, FRONTEND_URL } from "@/constants/constant";
const AnimatedImage = motion(Image);

const ForgotPasswordRequest = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const sendResetLinkHandler = async (event: any) => {
    event.preventDefault();

    let email = emailAddress;
    if (!validator.isEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const { data: response } = await axios.post("/api/forgot-password", {
        email,
      });
      setLoading(false);
      if (!response.error) {
        toast.success(response.message);
        setSuccessMessage(response.message);
        setEmailAddress("");
        setErrorMessage("");
      } else {
        toast.error(response.error);
        setErrorMessage(response.error);
        setSuccessMessage("");
      }
      setLoading(false);
    } catch (error: any) {
      toast.error("Something went wrong");
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fade w-full h-screen flex flex-row items-center justify-center relative">
      <div className="bg-white hidden pr-16 lg:flex h-full w-full flex-col justify-center z-50 bg-[url('/assets/login_wave.svg')] bg-no-repeat bg-cover">
      <AnimatedImage
          src="/assets/login-page.jpeg"
          height={700}
          width={700}
          alt="Image"
          quality={100}
          className="rounded-md cursor-pointer ml-auto "
          style={{
            rotateY: "0deg",
            originX: "center",
            originY: "center",
            perspective: "1000px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
            borderRadius: "10px",
            
          }}
          animate={{
            rotateY: ["-10deg", "10deg", "-10deg"],
            scale: [0.98, 1.02, 0.98],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            stiffness: 50,
          }}
        />
      </div>
      <div className="bg-white w-full px-4 lg:px-0 h-full flex justify-center items-center">
        <div className="w-[430px] mx-auto flex flex-row h-fit overflow-hidden">
          <div className="w-full px-2 lg:border-l-2 border-gray-200 sm:px-6 py-7 flex flex-col bg-white">
            <div className="pb-8 w-full h-full flex flex-col justify-end items-start  text-black">
              <h2 className="text-2xl capitalize mb-2 font-medium">
                <span className="text-indigo-500 font-semibold">SAYNGO</span>{" "}
                {/* do we know you ? */}
              </h2>
              <p className="text-sm">
                Ohh no! It seems you forgot your password.
              </p>
              <p className="text-sm text-indigo-500">
                {" "}
                Enter your email address below and we will send you a link to
                reset your password.{" "}
              </p>
            </div>
            <div className="w-full flex flex-col">
              <label className="text-sm mb-1 text-gray-700">Email</label>
              <input
                type="text"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="text-gray-700 w-full p-2.5 rounded-md border-[1.5px] focus:border-indigo-400 focus:outline-none text-sm"
                placeholder="Registered email.."
                onFocus={()=>{
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              />
              {errorMessage && (
                <div className="flex flex-row items-center mt-2">
                  <BiError className="text-red-500 text-xl" />
                  <span className="text-sm text-red-500 ml-2">
                    {errorMessage}
                  </span>
                </div>
              )}
              {successMessage && (
                <div className="flex flex-row items-center mt-2">
                  <MdOutlineDoneAll className="text-green-500 text-xl" />
                  <span className="text-sm text-green-500 ml-2">
                    {successMessage}
                  </span>
                </div>
              )}

              <div className="flex flex-row items-center mt-4">
                <button
                  onClick={sendResetLinkHandler}
                  disabled={loading}
                  className="w-full p-2 rounded-md bg-indigo-500 text-white focus:outline-none hover:opacity-90 disabled:opacity-60"
                >
                  {loading && <LoadingSpinner color="#ffff" />}
                  Send Link
                </button>
              </div>
            </div>
            {/* <div
              className="mt-4 cursor-pointer"
              onClick={() => {
                setIsSignUpPage(!isSignUpPage);
              }}
            > */}
            {/* {!isSignUpPage ? (
                <p className="text-sm text-gray-500 text-center">
                  Don{"'"}t have an account?{" "}
                  <span className="text-indigo-500 cursor-pointer text-xs">
                    Register Now
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  {" "}
                  Already have an account?{" "}
                  <span className="text-indigo-500 cursor-pointer text-xs">
                    Login
                  </span>
                </p>
              )} */}
            {/* </div> */}
            <div className="flex items-center center my-6">
              <div className="w-full border mr-4 h-fit"></div>
              <span className="text-gray-600 text-xs font-semibold whitespace-nowrap">
                know your business :)
              </span>
              <div className="w-full border ml-4 h-fit"></div>
            </div>
            {/* <div className="flex flex-row items-center">
                <button
                  // onClick={handleLogin}
                  className="w-full p-2 rounded-md border-2 border-indigo-500 text-indigo-500 focus:outline-none hover:border-indigo-400 hover:text-white hover:bg-indigo-400 transition-colors duration-300 ease-in-out"
                >
                  Get Started in Demo Mode
                </button>
              </div> */}
          </div>
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-center" autoClose={10000} />
    </div>
  );
};

export default ForgotPasswordRequest;

// <div className="flex justify-center items-center h-screen">
//   <form className="w-64 border rounded p-4 shadow-lg" onSubmit={loginHandler} >
//     <div className="mb-4">
//       <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
//         Username
//       </label>
//       <input
//         ref={usernameRef}
//         type="text"
//         id="username"
//         className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//         placeholder="Enter your username"
//         required
//       />
//     </div>
//     <div className="mb-4">
//       <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
//         Password
//       </label>
//       <input
//         ref={passwordRef}
//         type="password"
//         id="password"
//         className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
//         placeholder="Enter your password"
//         required
//       />
//     </div>
//     <div className="flex justify-center">
//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//       >
//         Login
//       </button>
//     </div>
//   </form>
// </div>
