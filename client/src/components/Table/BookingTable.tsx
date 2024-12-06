import React, { useState } from "react";

import { TbLoader } from "react-icons/tb";

import { InfinitySpin } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";

interface TableProps {
  date?: any;
  stayColor?: boolean;
  bookingData?: {
    hotelName?: string;
    guestName?: string;
    checkInDate?: string;
    checkOutDate?: string;
    roomCategory?: string;
    numberOfRooms?: string;
    numberOfPersons?: string;
    bookingAmount?: string;
    advanceAmount?: string;
    dueAmount?: string;
    advanceDate?: string;
    bookingSource?: string;
    bookingBy?: string;
    plan?: string;
    contactNumber?: string;
    remarks?: string;
    status?: string;
    accountType?: string;
  }[];
  setBookingData: any;
  getBooking: (booking: object) => void;
  setShowModal: (value: boolean) => void;
  cancelBookingHandler: (id: string) => void;
  undoCancelBookingHandler: (id: string) => void;
  owner?: any;
  loading?: boolean;
}

const BookingTable = ({
  date,
  stayColor,
  bookingData,
  getBooking,
  setShowModal,
  cancelBookingHandler,

  loading,
}: TableProps) => {
  const [showDeletePopup, setShowDeletePopUp] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");

  return (
    <div className="w-full">
      <div className="w-full min-w-full relative overflow-x-auto border shadow-md sm:rounded-lg cursor-pointer h-[460px] overflow-y-scroll">
        <table className="w-full min-w-full rounded-md text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
          <thead className="sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 ">
            <tr className=" whitespace-nowrap">
              <th scope="col" className="px-4 text-center py-3">
                #
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Hotel Name
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Guest Name
              </th>
              <th scope="col" className="px-6 text-center py-3">
                Contact Number
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Date
              </th>
              <th scope="col" className="px-6 text-center py-3">
                Number of Rooms
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Number of persons
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Room Category
              </th>
              <th scope="col" className="px-6 py-3">
                Booking Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Advance Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Due Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Advance Date
              </th>
              <th scope="col" className="px-6 py-3">
                Account Type
              </th>
              <th scope="col" className="px-4 text-center py-3">
                Booking Source
              </th>
              <th scope="col" className="px-6 py-3">
                Booking By
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Plan
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                GUEST EMAIL
              </th>
              <th scope="col" className="px-6 py-3">
                Remarks
              </th>
              <th scope="col" className="px-6 py-3">
                Creation Date
              </th>
              <th scope="col" className="px-6 py-3">
                Modification Date
              </th>
              {/* <th scope="col" className="px-4 text-center py-3">
                OPTIONS
              </th> */}
            </tr>
          </thead>
          <tbody className="rounded-xl dark:text-white">
            {bookingData?.length === 0 && (
              <tr className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <TbLoader className="text-4xl text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </tr>
            )}
            {bookingData && bookingData.length > 0 && (
              <>
                {loading ? (
                  <div className=" m-auto">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  bookingData?.map((booking: any, index: number) => {
                    const selectedDate = date ? new Date(date) : new Date();
                    let formattedSelectedDate = "";
                    if (
                      selectedDate instanceof Date &&
                      !isNaN(selectedDate as any)
                    ) {
                      formattedSelectedDate = selectedDate
                        .toISOString()
                        .split("T")[0];
                    }
                    const checkInDate = new Date(booking?.checkInDate)
                      .toISOString()
                      .split("T")[0];
                    const isCheckInSelectedDate =
                      formattedSelectedDate === checkInDate;

                    return (
                      <tr
                        title="Click to view"
                        onClick={() => {
                          getBooking(booking);
                          setShowModal(true);
                        }}
                        key={index}
                        className={`text-center light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600${booking?.status === "CANCELLED" ? "line-through" : ""}
    ${
      booking?.status === "CANCELLED"
        ? "text-red-400"
        : stayColor
          ? isCheckInSelectedDate
            ? "text-green-500 font-bold bg-green-200/50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800/50"
            : "text-indigo-500"
          : "text-black dark:text-white"
    }
  `}
                      >
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap text-center "
                        >
                          {booking?.serialNumber}
                        </th>
                        <td
                          scope="row"
                          className="px-6 py-2 font-medium whitespace-nowrap text-center "
                        >
                          {booking?.hotel?.hotelName || "DELETED HOTEL"}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {booking?.guestName || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.contactNumber || ""}
                        </td>
                        <td className="px-6 py-2 text-center ">
                          <p className="font-semibold whitespace-nowrap">
                            {new Date(booking?.checkInDate).toDateString()}
                          </p>
                          <span className="text-center">to</span>
                          <p className="font-semibold whitespace-nowrap">
                            {new Date(booking?.checkOutDate).toDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {booking.numberOfRooms || ""}
                        </td>
                        <td className="px-6 py-2">
                          {booking?.numberOfPersons || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.roomCategory || ""}
                        </td>
                        <td className="px-6 py-2">
                          {booking?.bookingAmount || ""}
                        </td>
                        <td className="px-6 py-2">
                          {booking?.advanceAmount || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.dueAmount || "PAID"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(booking?.advanceDate).toDateString() || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.accountType || ""}
                        </td>
                        <td className="px-6 py-4">
                          {booking.bookingSource || ""}
                        </td>
                        <td className="px-6 py-4">{booking.bookingBy || ""}</td>

                        <td className="px-6 py-2">
                          {booking?.status || "Created"}
                        </td>
                        <td className="px-6 py-4">{booking.plan || ""}</td>
                        <td className="px-6 py-4">
                          {booking.guestEmail || "No data"}
                        </td>

                        <td className="px-6 py-4">
                          {booking.remarks || "No remarks"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(booking?.createdAt).toDateString() || ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(booking?.updatedAt).toDateString() || ""}
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

      {showDeletePopup && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Cancel booking</h1>
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-sm text-gray-500 mr-4"
              >
                No
              </button>
              <button
                onClick={() => {
                  cancelBookingHandler(bookingId);
                  setShowDeletePopUp(false);
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

export default BookingTable;
