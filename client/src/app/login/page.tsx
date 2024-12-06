"use client";
import React, { useEffect, useState } from "react";
import LoginForm from "@/components/login";
import { useRouter } from "next/navigation";

type Props = {};

const LoginPage = (props: Props) => {
  let router = useRouter();
  // @ts-ignore
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user._id) {
    return router?.replace("/");
  }

  return <LoginForm />;
};

export default LoginPage;
