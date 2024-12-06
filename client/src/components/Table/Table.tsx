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
  // console.log(userData, "userdata");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingUserData, setEditingUserData] = useState<any>({});
  const [showDeletePopUp, setShowDeletePopUp] = useState<boolean>(false);
  const [showStatusPopUp, setShowStatusPopUp] = useState<boolean>(false);

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
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
              {/* <th scope="col" className="px-6 py-3">
              Password
            </th> */}
              {/* <th scope="col" className="px-6 py-3">
              Hotel
            </th> */}
              {/* <th scope="col" className="px-4 py-3 text-center">
                Role
              </th> */}
              {/* <th scope="col" className="px-4 py-3 text-center">
                Options
              </th> */}
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
                    // console.log(user.name);

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
                        {/* <td className="px-6 py-4"></td> */}
                        {/* <td className="px-6 py-4">{user.hotel || ""}</td> */}
                        {/* <td className="px-4 py-4 text-center">{user.role || ""}</td> */}
                        {/* <td className="px-4 py-2 text-center">
                        <div className="flex justify-center items-center">
                      <button
                            onClick= {()=>{
                                // console.log(user)
                                getUser(user);
                                setShowModal(true);

                            }}
                            className={`w-fit text-center p-2 shadow border bg-gray-100 text-blue-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                          >
                            <AiOutlineEye className="" />
                          </button>
                          <button
                            disabled={user.addedBy !== owner._id}
                            data-tip={"Edit User"}
                            onClick= {()=>{
                              setShowEditModal(true)
                              setEditingUserData(user)
                            }}
                            className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                          >
                            <FiEdit className="" />
                          </button>
                          <button
                            disabled={user.addedBy !== owner._id}
                            data-tip={"Delete User"}
                            onClick={()=> handleShowDeleteModal(user._id)}
                            className={`w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
                          >
                            <RiDeleteBin6Line size={15} className="" />
                          </button>
                          <button
                            disabled={user.addedBy !== owner._id}
                            data-tip={"Delete User"}
                            onClick={()=> handleShowStatusModal(user._id)}
                            className={`w-fit text-center p-2 ml-2 shadow border bg-gray-100 ${!user.isActive ? 'text-cyan-500': 'text-red-500'}  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td> */}
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
