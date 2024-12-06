"use client";
import React, { useEffect, useState } from "react";
import { fetchOwner } from "@/utils";
import { toast } from "react-toastify";
import {redirect, useRouter} from "next/navigation";


const AdminProtector =  ({ children }: { children: React.ReactNode }) => {

    const [accountType, setAccountType] = useState("");
    const [owner, setOwner] = useState({});
    const router = useRouter();

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

                router.push("/login");
            }
        };
        updateUser();
    }, []);


        if (accountType && accountType !== "ADMIN") {
            redirect("/bookings");
        }


    return accountType === "ADMIN" ? children : null;
};

export default AdminProtector;
