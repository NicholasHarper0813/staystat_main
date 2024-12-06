"use client";
import React, { useEffect, useState } from "react";
import { MdWarningAmber } from "react-icons/md";
import { TbLoader } from "react-icons/tb";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import axios from "@/utils/axios";
import EditUser from "../card/EditUser";
import { InfinitySpin } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";
interface TableProps {
  activityData: {
    _id?: string;
    user: any;
    action: string;
    ip: string;
    createdAt?: string;
  }[];
  owner: any;
  loading: boolean;
}

const ActivityTable = ({ activityData, owner, loading }: TableProps) => {
  // console.log(userData, "userdata");

  const [userId, setUserId] = useState<string>("");

  return (
    <div className="w-full mt-6">
      <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg cursor-pointer">
        <table className="w-full border border-gray-600/25 dark:border-gray-300/25 rounded-md text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
          <thead className="text-xs text-gray-900 uppercase dark:bg-gray-700 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-4 py-2 text-center">
                Name
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Role
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Ip
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Action
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl dark:text-white">
            {activityData.length === 0 && (
              <tr className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <TbLoader className="text-4xl text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </tr>
            )}
            {activityData.length > 0 && (
              <>
                {loading ? (
                  <div className=" m-auto">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  activityData.map((activity: any, index: number) => {
                    // console.log(user.name);

                    return (
                      <tr
                        key={index}
                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                        >
                          {activity?.user?.name ||
                            activity?.user?.username ||
                            ""}
                        </th>
                        <td
                          scope="row"
                          className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                        >
                          {activity?.user?.role || ""}
                        </td>
                        <td
                          scope="row"
                          className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                        >
                          {activity?.ipAddress || ""}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {activity.action || ""}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <p>
                            <h3 className="">
                              {new Date(activity.createdAt).toDateString()}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(
                                activity.createdAt
                              ).toLocaleTimeString()}
                            </p>
                          </p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
