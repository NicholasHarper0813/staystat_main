interface Props {
  user?: {
    _id?: string;
    isActive?: boolean;
    addedBy?: any;
    name?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    hotel?: {
      _id: string;
      hotelName: string;
    }[];
  };
  onClose: (value: boolean) => void;
  deleteUserHandler: (id?: string) => void;
  updateStatusHandler: (id?: string) => void;
  setShowEditModal: (value: boolean) => void;
  setEditingUserData: (value: any) => void;
  owner: any;
}

import Select from "react-select";

import { FaTimes } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

const ViewUser = ({ user, onClose, owner,deleteUserHandler,updateStatusHandler,setEditingUserData,setShowEditModal }: Props) => {
  const [showDeletePopUp, setShowDeletePopUp] = useState<boolean>(false);
  const [showStatusPopUp, setShowStatusPopUp] = useState<boolean>(false);
  // console.log( user, "userdata");

  const handleShowDeleteModal = (event: any) => {
    // setUserId(id);
    event.preventDefault();
    setShowDeletePopUp(true);
  };
  const handleShowStatusModal = (event: any) => {
    event.preventDefault();
    setShowStatusPopUp(true);
    // onClose(false)
  };

  return (

    <>
    <form className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl w-full">
      <TailwindWrapper>
      <div className="flex w-full mb-6">
        <p className="font-bold text-lg">User Details</p>
        <span
          onClick={() => onClose(false)}
          className="ml-auto cursor-pointer text-xl"
        >
          &times;
        </span>
      </div>
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <div>
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
            placeholder="Ex: Digha Saikatabas"
            value={user?.name}
            required
            disabled
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50 ${""} `}
            placeholder="+91 999999999"
            // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            value={user?.phoneNumber}
            disabled
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
            placeholder="hotel@company.com"
            value={user?.email}
            disabled
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Role
          </label>
          <input
            type="text"
            name="role"
            id="role"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
            placeholder="hotel@company.com"
            value={user?.role}
            disabled
            required
          />
        </div>

        <div className="w-[340px]">
          <label
            htmlFor="hotel"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Hotel Name
          </label>

          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[90%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
            value={
              user?.hotel?.map((hotel: any) => hotel.hotelName).join(", ") ||
              "Deleted Hotel"
            }
            disabled
          ></textarea>
        </div>
        <div></div>
        <div className=" flex">
          <button
            disabled={owner?.role !== "ADMIN" }
            data-tip={"Edit User"}
            onClick={(e) => {
              e.preventDefault()
              setShowEditModal(true);
              setEditingUserData(user);
              onClose(false);
            }}
            className={`flex justify-center items-center gap-2 w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
          >
            <FiEdit className="" size={20} />
            <p>Edit</p>
          </button>
          <button
            disabled={owner?.role !== "ADMIN"}
            data-tip={"Delete User"}
            onClick={(event) => handleShowDeleteModal(event)}
            className={`flex justify-center items-center gap-2 w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
          >
            <RiDeleteBin6Line size={15} className="" />
            <p>Delete</p>
          </button>
          <button
            disabled={owner?.role !== "ADMIN"}
            data-tip={"Delete User"}
            onClick={(event) => handleShowStatusModal(event)}
            className={`w-fit text-center p-2 ml-2 shadow border bg-gray-100 ${
              !user?.isActive ? "text-cyan-500" : "text-red-500"
            }  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
          >
            {user?.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
      </TailwindWrapper>
    </form>
    {
        showDeletePopUp && (
          <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex z-50 justify-center items-center overflow-hidden">
            <div className="w-1/3 bg-white rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold dark:text-black">Delete User</h1>
                <button onClick={()=> setShowDeletePopUp(false)} className="text-red-500 text-lg"><FaTimes/></button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Are you sure you want to delete this user?</p>
              <div className="flex justify-end items-center mt-6">
                <button onClick={()=> setShowDeletePopUp(false)} className="text-sm text-gray-500 mr-4">Cancel</button>
                <button onClick={()=> {
                  deleteUserHandler(user?._id)
                  setShowDeletePopUp(false)
                  onClose(false)
                }} className="text-sm text-red-500">Delete</button>
              </div>
            </div>
          </div>
        )
      }
      {
        showStatusPopUp && (
          <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden z-50">
            <div className="w-1/3 bg-white rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold dark:text-black">Activate/ Deactivate User</h1>
                <button onClick={()=> setShowStatusPopUp(false)} className="text-red-500 text-lg"><FaTimes/></button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Are you sure you want to activate/deactivate this user?</p>
              <div className="flex justify-end items-center mt-6">
                <button onClick={()=> setShowStatusPopUp(false)} className="text-sm text-gray-500 mr-4">No</button>
                <button onClick={()=> {
                  updateStatusHandler(user?._id)
                  setShowStatusPopUp(false)
                  onClose(false)
                }} className="text-sm text-red-500">Yes</button>
              </div>
            </div>
          </div>
        )

      }
    </>
  );
};

export default ViewUser;
