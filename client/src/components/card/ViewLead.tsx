interface Props {
  lead?: {
    _id?: string;
    guestName?: string;
    checkInDate?: string;
    checkOutDate?: string;
    numberOfPerson?: string;
    numberOfRooms?: string;
    contactNumber?: string;
    area?: string;
    budget?: string;
    specialRequirements?: string;
    status?: string;
    createdBy?: { name?: string; username?: string; _id?: string };
    approvedBy?: { name?: string; username?: string };
    isCancelled?: boolean;
    serialNumber?: string;
  };
  onClose: (value: boolean) => void;
  confirmLeadHandler: (id?: string) => void;
  setShowEditModal: (value: boolean) => void;
  setEditingLeadsData: (value: any) => void;
  owner?: any;
}

import Select from "react-select";

import { FaTimes } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { FiEdit } from "react-icons/fi";
// import { AiOutlineEye } from "react-icons/ai";
import { MdFileDownloadDone } from "react-icons/md";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

const ViewLead = ({ lead, onClose,owner,confirmLeadHandler,setEditingLeadsData,setShowEditModal }: Props) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [showStatusPopup, setShowStatusPopUp] = useState<boolean>(false);

  // console.log( lead, "userdata");

  

  return (
    <>
    <form className="p-6 items-cente rounded-lg shadow md:flex-row md:max-w-xl  w-full">
      <TailwindWrapper>
      <div className="flex w-full mb-6">
        <p className="font-bold text-lg">Lead Details</p>
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
            htmlFor="guest_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Guest Name  
           <span className="text-red-500">*</span>

          </label>
          <input
            type="text"
            name="guest_name"
            id="guest_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Ex: Digha Saikatabas"
            value={lead?.guestName}
            required
            disabled
          />
        </div>
        <div>
          <label
            htmlFor="check_in_date"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Check-in Date <span className="text-red-500">*</span>
          </label>
          <input
            id="check_in_date"
            name="check_in_date"
            type="text"
            value={new Date(lead?.checkInDate || "").toDateString()}
            disabled
            className="uppercase bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="08.08.2023"
          />
        </div>
        <div>
          <label
            htmlFor="check_out_date"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Check-out Date <span className="text-red-500">*</span>
          </label>
          <input
            id="check_out_date"
            name="check_out_date"
            type="text"
            value={new Date(lead?.checkOutDate || "").toDateString()}
            disabled
            className="uppercase bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="09.09.2023"
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
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            placeholder="+91 999999999"
            // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            value={lead?.contactNumber}
            disabled
          />
        </div>
        <div className="">
          <label
            htmlFor="nop"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            No. of Persons <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="nop"
            id="nop"
            value={lead?.numberOfPerson}
            disabled
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Eg. 4"
          />
        </div>
        <div className="">
          <label
            htmlFor="nor"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            No. of Rooms <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="nor"
            id="nor"
            value={lead?.numberOfRooms}
            disabled
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Eg. 2"
          />
        </div>
        <div className="">
          <label
            htmlFor="cn"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="cn"
            name="cn"
            value={lead?.contactNumber}
            disabled
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="+91 999999999"
          />
        </div>
        <div>
          <label
            htmlFor="area"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Area <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="area"
            id="area"
            value={lead?.area}
            disabled
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="budget"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Budget <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="budget"
            id="budget"
            disabled
            value={lead?.budget}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="createdBy"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Generated By <span className="text-red-500">*</span>
          </label>
          <input
            type="createdBy"
            name="createdBy"
            id="createdBy"
            disabled
            value={lead?.createdBy?.name || lead?.createdBy?.username || ""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="approvedBy"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Approved By <span className="text-red-500">*</span>
          </label>
          <input
            type="approvedBy"
            name="approvedBy"
            id="approvedBy"
            disabled
            value={lead?.approvedBy?.name || lead?.approvedBy?.username || "Not approved yet"}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="">
          <label
            htmlFor="specialReq"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap"
          >
            Special Requirements
          </label>
          <textarea
            cols={8}
            value={lead?.specialRequirements}
            disabled
            id="specialReq"
            name="specialReq"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
          />
        </div>

        {/* <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            />
          </div> */}
          <div className="flex">
                              
                              <button
                                // disabled={user.addedBy !== owner._id}
                                data-tip={"Edit Lead"}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setShowEditModal(true);
                                  setEditingLeadsData(lead);
                                  onClose(false)
                                }}
                                disabled={
                                  updating ||
                                  (lead?.createdBy?._id !== owner?._id &&
                                    owner?.role !== "ADMIN") ||
                                  lead?.status === "CONFIRMED"
                                }
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                              >
                                <FiEdit size={20} className="inline-block" />{" "}
                                Edit
                              </button>

                              <button
                                // disabled={user.addedBy !== owner._id}
                                data-tip={"update Lead"}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setShowStatusPopUp(true);
                                  
                                }}
                                disabled={
                                  lead?.status === "CONFIRMED" || updating
                                }
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                              >
                                <MdFileDownloadDone
                                  size={20}
                                  className="inline-block"
                                />{" "}
                                {lead?.status === "CONFIRMED"
                                  ? "Confirmed"
                                  : "Confirm"}
                              </button>
                            </div>

      </div>
      </TailwindWrapper>
    </form>
    {showStatusPopup && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-black">Confirm Lead</h1>
              <button
                onClick={() => setShowStatusPopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to confirm this lead?
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
                  confirmLeadHandler(lead?._id);
                  setShowStatusPopUp(false);
                  onClose(false)
                }}
                className="text-sm text-red-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewLead;
