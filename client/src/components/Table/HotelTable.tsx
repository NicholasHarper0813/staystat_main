"use client";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdWarningAmber } from "react-icons/md";
import { TbLoader } from "react-icons/tb";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import EditHotel from "../card/EditHotel";
import { InfinitySpin } from "react-loader-spinner";
interface TableProps {
  hotelData: {
    serialNumber?: string;
    hotelName?: string;
    ownerName?: string;
    location?: string;
    ownerContact?: {
      email?: string;
      phone?: string;
    };
    bank?: string;
    GSTNumber?: string;
    panNumber?: string;
    aadharNumber?: string;
    tradeLicense?: string;

    frontOfficeContact?: string;
  }[];
  setHotelData: any;
  getHotel: (hotel: object) => void;
  setShowModal: (value: boolean) => void;
  deleteHotelHandler: (id: string) => void;
  updateStatusHandler: (id: string) => void;

  owner?: any;
  loading?: boolean;
}

const HotelTable = ({
  hotelData,
  setHotelData,
  getHotel,
  setShowModal,
  deleteHotelHandler,
  updateStatusHandler,
  owner,
  loading,
}: TableProps) => {
 
  const [showDeletePopup, setShowDeletePopUp] = useState<boolean>(false);
  const [showStatusPopup, setShowStatusPopUp] = useState<boolean>(false);

  const [hotelId, setHotelId] = useState<string>("");

  // useEffect(() => {
  //   if (showEditHotelModal) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "unset";
  //   }
  // }, [showEditHotelModal]);

  const handleShowDeleteModal = (id: string) => {
    setHotelId(id);
    setShowDeletePopUp(true);
  };

  const handleShowStatusModal= (id: string) =>{
    setHotelId(id)
    setShowStatusPopUp(true)
  }

  return (
    <div className="w-full">
      <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg cursor-pointer">
        <table className="w-full border border-gray-600/25 dark:border-gray-300/25 rounded-md text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
          <thead className="text-sm text-gray-900 uppercase dark:bg-gray-700 dark:text-gray-400 whitespace-nowrap border">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Hotel Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Owner Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Onwer Email
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Office Contact
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Bank Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                GST Number
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                IFSC Code
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Account Number
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Pan Number
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Aadhar Number
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Trade License Number
              </th>

              {/* <th scope="col" className="px-6 py-3 text-center">
                Options
              </th> */}
            </tr>
          </thead>
          <tbody className="rounded-xl dark:text-white">
            {hotelData.length === 0 && (
              <tr className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <TbLoader className="text-4xl text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </tr>
            )}

            {hotelData.length > 0 && (
              <>
                {loading ? (
                  <div className=" m-auto">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  hotelData.map((hotel: any, index: number) => {
                    //   console.log(hotel.hotelName);

                    return (
                      <tr
                      title="Click to view"
                        key={index}
                        onClick={() => {
                          // console.log(hotel);
                          getHotel(hotel);
                          setShowModal(true);
                        }}
                        className="whitespace-nowrap light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="text-center px-6 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                        >
                          {hotel.serialNumber || ""}
                        </th>
                        <td
                          scope="row"
                          className="text-center px-6 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                        >
                          {hotel.hotelName || ""}
                        </td>
                        <td className="px-6 py-2 text-center whitespace-nowrap">
                          {hotel.ownerName || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.location || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.ownerContact.email || "No data"}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.frontOfficeContact}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.ownerContact.phone || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.bank || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.GSTNumber || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.ifscCode || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.accountNumber || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.panNumber || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {hotel.aadharNumber || ""}
                        </td>

                        <td className="px-6 py-2 text-center">
                          {hotel.tradeLicense || ""}
                        </td>

                        {/* <td className="px-6 py-2 text-center">
                          <div className="flex justify-center items-center">
                            <button
                              // disabled={user.addedBy !== owner._id}
                              // data-tip={"Preview Link"}
                              onClick={() => {
                                // console.log(hotel);
                                getHotel(hotel);
                                setShowModal(true);
                              }}
                              className={`w-fit text-center p-2 shadow border bg-gray-100 text-blue-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                            >
                              <AiOutlineEye className="" />
                            </button>
                            <button
                              disabled={
                                hotel.addedBy._id !== owner._id &&
                                owner.role !== "ADMIN"
                              }
                              // data-tip={"Preview Link"}
                              onClick={() => {
                                // setShowEditHotelModal(true);
                                // setEditingHotelData(hotel);
                              }}
                              className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                            >
                              <FiEdit className="" />
                            </button>
                            <button
                              disabled={
                                hotel.addedBy._id !== owner._id &&
                                owner.role !== "ADMIN"
                              }
                              data-tip={"Delete Hotel"}
                              onClick={() => {
                                handleShowDeleteModal(hotel._id);
                              }}
                              className={`w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
                            >
                              <RiDeleteBin6Line size={15} className="" />
                            </button>
                            <button
                            disabled={hotel.addedBy._id !== owner._id &&
                              owner.role !== "ADMIN"}
                            data-tip={"Delete User"}
                            onClick={()=> handleShowStatusModal(hotel._id)}
                            className={`w-fit text-center p-2 ml-2 shadow border bg-gray-100 ${!hotel.isActive ? 'text-cyan-500': 'text-red-500'}  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
                          >
                            {hotel.isActive ? "Deactivate" : "Activate"}
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
      
      {showDeletePopup && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Delete Hotel</h1>
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
                  deleteHotelHandler(hotelId);
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
      {showStatusPopup && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Active / Deactive Hotel</h1>
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
                  updateStatusHandler(hotelId);
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

export default HotelTable;
