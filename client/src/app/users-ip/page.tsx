"use client";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import ViewUser from "@/components/card/ViewUsers";
import InputEmp from "@/components/card/InputEmp";
import Table from "@/components/Table/Table";
import axios from "@/utils/axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { FcNext, FcPrevious } from "react-icons/fc";
import { BiLink, BiSearch } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaPlus, FaTimes } from "react-icons/fa";
import { CiSquareRemove } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { utils, writeFile } from "xlsx";
import { fetchOwner } from "@/utils";

import { FRONTEND_URL } from "@/constants/constant";
import ActivityTable from "@/components/Table/ActivityTable";
import EditUser from "@/components/card/EditUser";

const PAGE_LIMIT = 20;
const Activities = () => {
  let router = useRouter();
  const [owner, setOwner] = useState<any>({});
  const [accountType, setAccountType] = useState<string>("");
  const [activityData, setActivityData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
    let updateUser = async () => {
      // (existing code remains the same)
    };
    updateUser();
  }, []);

  useEffect(() => {
    const getActivities = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/get-all-activities`);
        if (!data.error) {
          setActivityData(data.activities);
        } else {
          toast.error(data.error);
        }
        setLoading(false);
      }
      catch (error: any) {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      }
    };

    getActivities();
  }, []);

  const totalActivities = activityData.length;
  const totalPages = Math.ceil(totalActivities / PAGE_LIMIT);
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * PAGE_LIMIT;
  const endIndex = Math.min(startIndex + PAGE_LIMIT, totalActivities);
  const currentData = activityData.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex w-full flex-col justify-center gap-4 items-center overflow-hidden">
        <div className="flex flex-col w-full">
          <div className="flex flex-row h-full text-gray-700">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="border p-3 shadow hover:bg-gray-200 cursor-pointer hover:opacity-90 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcPrevious />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="border p-3 shadow hover:bg-gray-200 cursor-pointer hover:opacity-90 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcNext />
            </button>
          </div>
          <ActivityTable
            activityData={currentData}
            owner={owner}
            loading={loading}
          />
        </div>
        <ToastContainer theme="dark" position="bottom-center" autoClose={10000} />
      </div>
    </>
  );
};

export default Activities;
