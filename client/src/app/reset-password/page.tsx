"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordRequest from "@/components/ForgotPasswordRequest";

type Props = {};

const ForgetPassword = (props: Props) => {
  let router = useRouter();
  // @ts-ignore
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user._id) {
    return router?.replace("/");
  }

  return <ForgotPasswordRequest />;
};

export default ForgetPassword;
