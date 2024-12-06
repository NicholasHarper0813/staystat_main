import { Button } from "@nextui-org/react";
import { FaTimes, FaUndo } from "react-icons/fa";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";
import { Send } from "lucide-react";
import axios from "@/utils/axios";
import { toast } from "react-toastify";

interface Props {
  booking: {
    _id: string;
    hotel: {
      hotelName: string;
    };
    guestName: string;
    checkInDate: Date;
    checkOutDate: Date;
    roomCategory: string;
    numberOfRooms: number;
    numberOfPersons: number;
    bookingAmount: number;
    dueAmount: number;
    advanceAmount: number;
    advanceDate: Date;
    bookingSource: string;
    bookingBy: string;
    accountType: string;
    plan: string;
    guestEmail: string;
    contactNumber: string;
    remarks: string;
    status: string;
  };
  cancelBookingHandler: (id: string) => void;
  undoCancelBookingHandler: (id: string) => void;
  setEditingBookingData: (data: any) => void;
  setShowEditModal: (value: boolean) => void;
  onClose: (value: boolean) => void;
}

const ViewBooking = ({
  booking,
  onClose,
  cancelBookingHandler,
  undoCancelBookingHandler,
  setShowEditModal,
  setEditingBookingData,
}: Props) => {
  const [showDeletePopup, setShowDeletePopUp] = useState<boolean>(false);
  const [showUndoDeletePopup, setShowUndoDeletePopUp] =
    useState<boolean>(false);
  // console.log(booking, "userdata");
  const [isSending, setIsSending] = useState(false);
  const handleShowDeleteModal = (event: any) => {
    event.preventDefault();
    setShowDeletePopUp(true);
    // onClose(false)
  };

  const handleShowUndoDeleteModal = (event: any) => {
    event.preventDefault();
    setShowUndoDeletePopUp(true);
  };
  const handleSendSMS = async () => {
    setIsSending(true);
    const message = `Dear ${booking.guestName}, your booking at ${booking.hotel.hotelName} has been ${booking.status}. Your check-in is scheduled for ${booking.checkInDate}, and check-out is on ${booking.checkOutDate}. You have booked ${booking.numberOfRooms} rooms for ${booking.numberOfPersons} guests. The booking amount is ₹${booking.bookingAmount}, with an advance payment of ₹${booking.advanceAmount}. The due amount is ₹${booking.dueAmount}. You have chosen the ${booking.plan} plan. Your contact number is ${booking.contactNumber}. Thank you for choosing ${booking.hotel.hotelName}. For any assistance, you can reach out to us at "+91 97483 14053".`;

    try {
      await axios.post("/send-sms", {
        to: "+91" + booking?.contactNumber,
        body: message,
      });
      toast.success("SMS sent successfully");
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("Failed to send SMS");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <form className="z-50 p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl ">
        <TailwindWrapper>
          <div className="flex w-full mb-6">
            <p className="font-bold text-lg">Booking Details</p>
            <span
              onClick={() => onClose(false)}
              className="ml-auto cursor-pointer text-xl"
            >
              &times;
            </span>
          </div>
          <div className="grid gap-2 grid-cols-3  md:grid-cols-3">
            {/* <div>
            <label
              htmlFor="hotel"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Hotel Name
            </label>
            <input
              type="text"
              id="hotel"
              name="hotel"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ex: Digha Saikatabas"
              required
            />
          </div> */}
            <div>
              <label
                htmlFor="hotel"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Hotel Name
              </label>
              <input
                type="text"
                id="hotel"
                name="hotel"
                value={booking?.hotel?.hotelName || "Deleted hotel"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ex: Digha Saikatabas"
                required
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="guest_name"
                className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Guest Name
              </label>
              <input
                value={booking?.guestName}
                type="text"
                id="guest_name"
                name="guest_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ex: Subham"
                required
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="check_in_date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Check-in Date
              </label>
              <input
                value={new Date(booking?.checkInDate).toDateString()}
                id="startDate"
                name="startDate"
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="08.08.2023"
                required
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="check_out_date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Check-out Date
              </label>
              <input
                value={new Date(booking?.checkOutDate).toDateString()}
                id="endDate"
                name="endDate"
                type="text"
                disabled
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="09.09.2023"
                required
              />
            </div>
            <div>
              <label
                htmlFor="roomCategory"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Room Category
              </label>
              <input
                id="endDate"
                name="endDate"
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="09.09.2023"
                required
                disabled
                value={booking?.roomCategory}
              />
            </div>
            <div>
              <label
                htmlFor="roomCategory"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Account Type
              </label>
              <input
                id="endDate"
                name="endDate"
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="09.09.2023"
                required
                disabled
                value={booking?.accountType}
              />
            </div>
            <div>
              <label
                htmlFor="nor"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Number of Room
              </label>
              <input
                type="text"
                id="nor"
                name="nor"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="20"
                required
                disabled
                value={booking?.numberOfRooms}
              />
            </div>
            <div>
              <label
                htmlFor="nop"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Number of Person
              </label>
              <input
                type="text"
                id="nop"
                name="nop"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="4"
                required
                disabled
                value={booking?.numberOfPersons}
              />
            </div>
            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Booking Amount
              </label>
              <input
                name="bookingAmount"
                type="text"
                id="bookingAmount"
                value={booking?.bookingAmount}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter booking amount"
                required
                disabled
              />
            </div>
            <div className="">
              <label
                htmlFor="da"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Advance Amount
              </label>
              <input
                name="advanceAmount"
                type="text"
                id="advanceAmount"
                value={booking?.advanceAmount}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter advance amount"
                required
                disabled
              />
            </div>
            <div className="">
              <label
                htmlFor="da"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Due Amount
              </label>
              <input
                name="dueamount"
                id="duedate"
                type="text"
                value={booking?.dueAmount}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                disabled
              />
            </div>

            <div className="">
              <label
                htmlFor="ad"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Advance Date
              </label>
              <input
                value={new Date(booking?.advanceDate).toDateString()}
                id="Advancedate"
                name="Advancedate"
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="24.05.26"
                required
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="paymentby"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Booking Source
              </label>
              <input
                id="Advancedate"
                name="Advancedate"
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="24.05.26"
                required
                disabled
                value={booking?.bookingSource}
              />
            </div>
            <div className="">
              <label
                htmlFor="bb"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Booking By
              </label>
              <input
                type="text"
                id="bb"
                name="bb"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Someone"
                disabled
                required
                value={booking?.bookingBy}
              />
            </div>
            <div>
              <label
                htmlFor="plan"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Plan
              </label>
              <input
                type="text"
                id="bb"
                name="bb"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled
                required
                value={booking?.plan}
              />
            </div>
            <div className="">
              <label
                htmlFor="cn"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Contact Number
              </label>
              <input
                type="number"
                id="cn"
                name="cn"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="+91 999999999"
                required
                value={booking?.contactNumber}
                disabled
              />
            </div>
            <div className="">
              <label
                htmlFor="cn"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Guest Email
              </label>
              <input
                type="text"
                id="cn"
                name="cn"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={booking?.guestEmail}
                disabled
              />
            </div>

            <div className="">
              <label
                htmlFor="remark"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Remarks
              </label>
              <input
                value={booking?.remarks}
                type="text"
                id="remark"
                name="remark"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Very Good"
                required
                disabled
              />
            </div>
          </div>
          <div className="flex justify-start gap-1 items-center mt-8">
            <Button
              disabled={booking?.status === "CANCELLED"}
              data-tip={"Preview Link"}
              onClick={(e) => {
                e.preventDefault();
                setShowEditModal(true);
                setEditingBookingData(booking);
                onClose(false);
              }}
              className="defaultBtnView"
              endContent={<FiEdit className="" size={15} />}
            >
              <p>Edit</p>
            </Button>
            <Button
              onClick={(event) => handleShowDeleteModal(event)}
              className="defaultBtnView"
              disabled={booking?.status === "CANCELLED"}
              endContent={<FaTimes size={15} />}
            >
              <span className="m-0 p-0">Cancel Booking</span>
            </Button>
            <Button
              onClick={(event) => handleShowUndoDeleteModal(event)}
              className="defaultBtnView"
              disabled={booking?.status === "CONFIRMED"}
              endContent={<FaUndo size={15} className="" />}
            >
              <span className="m-0 p-0">Undo Cancellation</span>
            </Button>
            <Button
              className="defaultBtnView"
              endContent={<Send size={15} />}
              onClick={handleSendSMS}
              disabled={isSending}
              isLoading={isSending}
            >
              {isSending ? "Sending..." : "Send SMS"}
            </Button>
          </div>
        </TailwindWrapper>
      </form>
      {showDeletePopup && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-black">Cancel booking</h1>
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
                  cancelBookingHandler(booking._id);
                  setShowDeletePopUp(false);
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
      {showUndoDeletePopup && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-black">
                Undo Booking Cancelletion
              </h1>
              <button
                onClick={() => setShowUndoDeletePopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you wish to undo the cancellation?
            </p>
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowUndoDeletePopUp(false)}
                className="text-sm text-gray-500 mr-4"
              >
                No
              </button>
              <button
                onClick={() => {
                  undoCancelBookingHandler(booking._id);
                  setShowUndoDeletePopUp(false);
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
    </div>
  );
};

export default ViewBooking;
