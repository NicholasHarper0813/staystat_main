"use client";
import React, { useEffect, useState } from "react";
import ForgotPasswordRequest from "@/components/ForgotPasswordRequest";
import { useRouter } from "next/navigation";

type Props = {};

const ForgetPassword = (props: Props) => {
  let router = useRouter();
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user._id)
  {
    return router?.replace("/");
  }

  return <ForgotPasswordRequest />;
};

export default ForgetPassword;
