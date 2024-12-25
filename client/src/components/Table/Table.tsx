"use client";
import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import EditUser from "../card/EditUser";
import { MdWarningAmber } from "react-icons/md";
import { TbLoader } from "react-icons/tb";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import { InfinitySpin } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";

interface TableProps {
  userData: {
    name?: string;
    phone?: string;
    email?: string;
    hotel?: string;
  }[];
  getUser: (user: object) => void;
  setShowModal: (value: boolean) => void;
  deleteUserHandler: (id: string) => void;
  updateStatusHandler: (id: string) => void;
  setUserData: (users: any) => void;
  owner?: any;
  loading?: boolean;
  serialNumber?: string;
}

const Table = ({
  userData,
  deleteUserHandler,
  updateStatusHandler,
  setUserData,
  getUser,
  setShowModal,
  owner,
  loading,
}: TableProps) => {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingUserData, setEditingUserData] = useState<any>({});
  const [showDeletePopUp, setShowDeletePopUp] = useState<boolean>(false);
  const [showStatusPopUp, setShowStatusPopUp] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (showEditModal)
    {
      document.body.style.overflow = "hidden";
    } 
    else 
    {
      document.body.style.overflow = "unset";
    }
  }, [showEditModal]);

  const handleShowDeleteModal = (id: string) => {
    setUserId(id);
    setShowDeletePopUp(true);
  };
  const handleShowStatusModal = (id: string) => {
    setUserId(id);
    setShowStatusPopUp(true);
  };

  return (
    <div className="w-full">
      <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg cursor-pointer">
        <table className="w-full border border-gray-600/25 dark:border-gray-300/25 rounded-md text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
          <thead className="text-sm text-gray-900 uppercase dark:bg-gray-700 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-4 py-2 text-center">
                #
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Phone
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl dark:text-white">
            {userData.length === 0 && (
              <tr className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <TbLoader className="text-4xl text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </tr>
            )}
            {userData.length > 0 && (
              <>
                {loading ? (
                  <div className=" m-auto">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  userData.map((user: any, index: number) => {
                    return (
                      <tr
                        title="Click to view user details"
                        onClick={() => {
                          // console.log(user)
                          getUser(user);
                          setShowModal(true);
                        }}
                        key={index}
                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                        >
                          {user.serialNumber || ""}
                        </th>
                        <td
                          scope="row"
                          className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                        >
                          {user.name || ""}
                        </td>
                        <td className=" px-4 py-2 text-center">
                          {user.phoneNumber || ""}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {user.email || ""}
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
      {showEditModal && editingUserData && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <EditUser
            onClose={(value) => setShowEditModal(value)}
            setUserData={setUserData}
            editingUserDataProps={editingUserData}
            userData={userData}
          />
        </div>
      )}
      {showDeletePopUp && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Delete User</h1>
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-sm text-gray-500 mr-4"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUserHandler(userId);
                  setShowDeletePopUp(false);
                }}
                className="text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showStatusPopUp && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Activate/ Deactivate User</h1>
              <button
                onClick={() => setShowStatusPopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to activate/deactivate this user?
            </p>
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowStatusPopUp(false)}
                className="text-sm text-gray-500 mr-4"
              >
                No
              </button>
              <button
                onClick={() => {
                  updateStatusHandler(userId);
                  setShowStatusPopUp(false);
                }}
                className="text-sm text-red-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
