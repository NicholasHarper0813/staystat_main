interface Props {
  hotel?: {
    _id: string;
    addedBy: {
      _id: string;
      role: string;
    };
    hotelName?: string;
    ownerName?: string;
    location?: string;
    bank?: string;
    GSTNumber?: string;
    panNumber?: string;
    aadharNumber?: string;
    tradeLicense?: string;
    otherDocuments?: string;
    ownerContact?: {
      email?: string;
      phone?: string;
    };
    frontOfficeContact?: string;
    accountNumber?: string;
    ifscCode?: string;
    roomCategories?: Array<string>;
    isActive?: boolean;
  };
  owner: any;
  onClose: (value: boolean) => void;
  deleteHotelHandler: (id?: string) => void;
  updateStatusHandler: (id?: string) => void;
  setEditingHotelData: (data: any) => void;
  setShowEditHotelModal: (value: boolean) => void;
}

import { FaTimes } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

const ViewHotel = ({
  hotel,
  onClose,
  owner,
  deleteHotelHandler,
  updateStatusHandler,
  setEditingHotelData,
  setShowEditHotelModal,
}: Props) => {
  const [showDeletePopup, setShowDeletePopUp] = useState<boolean>(false);
  const [showStatusPopup, setShowStatusPopUp] = useState<boolean>(false);
  // console.log(hotel, "userdata");

  const handleShowDeleteModal = (event: any) => {
    event.preventDefault();
    setShowDeletePopUp(true);
    // onClose(false)
  };

  const handleShowStatusModal = (event: any) => {
    event.preventDefault();
    setShowStatusPopUp(true);
    // onClose(false)
  };

  return (
    <>
      <form className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl ">
        <TailwindWrapper>
          <div className="flex mb-6">
            <p className="text-lg font-bold">Hotel Details</p>
            <span
              onClick={() => onClose(false)}
              className="ml-auto cursor-pointer text-xl"
            >
              &times;
            </span>
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-3">
            <div className="">
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Hotel Name
              </label>
              <input
                disabled
                value={hotel?.hotelName}
                type="text"
                name="hotelName"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ex: Digha Saikatabas"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Location
              </label>
              <input
                disabled
                value={hotel?.location}
                name="location"
                type="text"
                id="last_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ex: Digha"
                required
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Owner Name
              </label>
              <input
                disabled
                value={hotel?.ownerName}
                name="ownerName"
                type="text"
                id="company"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Subham"
                required
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
                disabled
                value={hotel?.ownerContact?.phone}
                name="phoneNumber"
                type="tel"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="+91 999999999"
                required
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Bank
              </label>
              <input
                disabled
                value={hotel?.bank}
                name="bank"
                type="text"
                id="bank"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="State Bank"
                required
              />
            </div>
            <div className="">
              <label
                htmlFor="accountNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Account Number
              </label>
              <input
                name="accountNumber"
                type="number"
                id="accountNumber"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0112345678"
                required
                disabled
                value={hotel?.accountNumber}
              />
            </div>
            <div className="">
              <label
                htmlFor="accountNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                IFSC Code
              </label>
              <input
                name="ifscCode"
                type="text"
                id="ifscCode"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="SBIN0005943"
                disabled
                value={hotel?.ifscCode}
                required
              />
            </div>
            <div>
              <label
                htmlFor="visitors"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                GST Number
              </label>
              <input
                disabled
                value={hotel?.GSTNumber}
                name="GSTNumber"
                type="text"
                id="visitors"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="GST Number"
                required
              />
            </div>
            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <input
                disabled
                value={hotel?.ownerContact?.email}
                name="email"
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="hotel@company.com"
                required
              />
            </div>

            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Pan Number
              </label>
              <input
                disabled
                value={hotel?.panNumber}
                name="panNumber"
                type="text"
                id="pan"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="AAAAA 1234A"
                required
              />
            </div>
            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Aadhar Number
              </label>
              <input
                disabled
                value={hotel?.aadharNumber}
                name="aadharNumber"
                type="number"
                id="adhar"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="2625-2331-7140"
                required
              />
            </div>

            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Trade License
              </label>
              <input
                disabled
                value={hotel?.tradeLicense}
                name="tradeLicense"
                type="text"
                id="Tread"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="2625-2331-7140"
                required
              />
            </div>
            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Other Documents
              </label>
              <button name="">
                <a className="defaultBtn" href={hotel?.otherDocuments}>
                  View Document
                </a>
              </button>
            </div>
            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Front Office Contact
              </label>
              <input
                disabled
                value={hotel?.frontOfficeContact}
                name="frontOfficeContact"
                type="text"
                id="Other Documents"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Other Document"
                required
              />
            </div>

            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Room Categories
              </label>
              <textarea
                disabled
                value={hotel?.roomCategories}
                name="frontOfficeContact"
                id="Other Documents"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Other Document"
                required
              />
            </div>
            <div className=" flex flex-col">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
              <input
                disabled
                value={hotel?.isActive ? "Active" : "Deactive"}
                name="frontOfficeContact"
                type="text"
                id="Other Documents"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Other Document"
                required
              />
            </div>
            <div className=" flex items-end">
              <button
                disabled={
                  hotel?.addedBy._id !== owner._id && owner.role !== "ADMIN"
                }
                // data-tip={"Preview Link"}
                onClick={(e) => {
                  e.preventDefault();

                  setShowEditHotelModal(true);
                  setEditingHotelData(hotel);
                  onClose(false);
                }}
                className={`flex justify-center items-center gap-2 w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
              >
                <FiEdit className="" size={20} />
                <p>Edit</p>
              </button>
              <button
                disabled={
                  hotel?.addedBy._id !== owner._id && owner.role !== "ADMIN"
                }
                data-tip={"Delete Hotel"}
                onClick={(event) => handleShowDeleteModal(event)}
                className={`flex justify-center items-center gap-2 w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
              >
                <RiDeleteBin6Line size={15} className="" />
                <p>Delete</p>
              </button>
              <button
                disabled={
                  hotel?.addedBy._id !== owner._id && owner.role !== "ADMIN"
                }
                data-tip={"Delete User"}
                onClick={(event) => handleShowStatusModal(event)}
                className={`w-fit text-center p-2 ml-2 shadow border bg-gray-100 ${
                  !hotel?.isActive ? "text-cyan-500" : "text-red-500"
                }  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
              >
                {hotel?.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </TailwindWrapper>
      </form>
      {showDeletePopup && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-black">Delete Hotel</h1>
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this hotel?
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
                  deleteHotelHandler(hotel?._id);
                  setShowDeletePopUp(false);
                  onClose(false);
                }}
                className="text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showStatusPopup && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-black">
                Active / Deactive Hotel
              </h1>
              <button
                onClick={() => setShowStatusPopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to active / deactive this hotel?
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
                  updateStatusHandler(hotel?._id);
                  setShowStatusPopUp(false);
                  onClose(false);
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

export default ViewHotel;
