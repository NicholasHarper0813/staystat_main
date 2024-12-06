interface Props {
  setBookingData: (users: any) => void;
  onClose: (value: boolean) => void;
  editingBookingDataProps?: any;
  bookingData?: any;
  owner?: any;
}
import { toast } from "react-toastify";
import axios from "@/utils/axios";
import React, { useState, useEffect, useRef } from "react";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

const EditBooking = ({
  setBookingData,
  onClose,
  editingBookingDataProps,
  bookingData,
  owner,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedData, setUpdatedData] = useState(false);
  const [editingBookingData, setEditingBookingData] = useState<any>(
    editingBookingDataProps
  );
  const [phoneNumber, setPhoneNumber] = useState(
    editingBookingData.contactNumber
  );
  const [checkInDate, setCheckInDate] = useState<string>(
    editingBookingData.checkInDate.split("T")[0]
  );
  const [checkOutDate, setCheckOutDate] = useState<string>(
    editingBookingData.checkOutDate.split("T")[0]
  );
  const [advanceDate, setAdvanceDate] = useState<string>(
    editingBookingData.advanceDate.split("T")[0]
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (updatedData) {
      setUpdatedData(false);
      window.location.reload();
    }
  }, [updatedData]);

  useEffect(() => {
    setEditingBookingData(editingBookingDataProps);
  }, [editingBookingDataProps]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length <= 10) {
      setPhoneNumber(input);
    }
    setEditingBookingData((prev: any) => {
      return { ...prev, contactNumber: input };
    });
  };

  const handleRoomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setEditingBookingData((prev: any) => {
      const roomCategory = e.target.value.toLocaleUpperCase();
      return {
        ...prev,
        roomCategory: roomCategory,
      };
    });
  };

  const handleCheckInDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    const [year, month, day] = inputDate.split("-");

    let fullYear = year;
    const currentYear = new Date().getFullYear().toString();

    if (year.toString().slice(0, 3) !== "000") {
      fullYear = `20${year.toString().slice(-2)}`;
      if (fullYear.slice(-2) !== currentYear.slice(-2)) {
        toast.warning("Check-in Date does not match the current year !!");
        toast.clearWaitingQueue();
      }
    }

    const formattedDate = `${fullYear}-${month}-${day}`;

    setCheckInDate(formattedDate);

    setEditingBookingData((prev: any) => {
      return { ...prev, checkInDate: formattedDate };
    });
  };

  const handleCheckOutDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    const [year, month, day] = inputDate.split("-");

    let fullYear = year;
    const currentYear = new Date().getFullYear().toString();

    if (year.toString().slice(0, 3) !== "000") {
      fullYear = `20${year.toString().slice(-2)}`;
      if (fullYear.slice(-2) !== currentYear.slice(-2)) {
        toast.warning("Check-Out Date does not match the current year !!");
        toast.clearWaitingQueue();
      }
    }

    const formattedDate = `${fullYear}-${month}-${day}`;

    setCheckOutDate(formattedDate);

    setEditingBookingData((prev: any) => {
      return { ...prev, checkOutDate: formattedDate };
    });
  };

  const handleAdvanceDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    const [year, month, day] = inputDate.split("-");

    let fullYear = year;
    const currentYear = new Date().getFullYear().toString();

    if (year.toString().slice(0, 3) !== "000") {
      fullYear = `20${year.toString().slice(-2)}`;
      if (fullYear.slice(-2) !== currentYear.slice(-2)) {
        toast.warning("Advance Date does not match the current year !!");
        toast.clearWaitingQueue();
      }
    }

    const formattedDate = `${fullYear}-${month}-${day}`;

    setAdvanceDate(formattedDate);
    setEditingBookingData((prev: any) => {
      return { ...prev, advanceDate: formattedDate };
    });
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: string } = {};

    formData.forEach((value, key) => {
      formValues[key] = value as string;
      if (formValues[key].trim() === "") {
        if (key !== "remark" && key !== "guestEmail") {
          toast.error("Please fill all the fields");
        }
        return;
      }
    });

    const numberRegex = /^[0-9]+$/;
    const nameRegex = /^[a-zA-Z ]+$/;

    if (!nameRegex.test(formValues.guest_name)) {
      toast.error("Guest name should contain only alphabets");
      return;
    }

    if (
      formValues.cn.trim() === "" ||
      !numberRegex.test(formValues.cn.trim()) ||
      formValues.cn.trim().length !== 10
    ) {
      toast.error("Please enter a valid contact number and don't include +91");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/booking/update-booking", {
        id: editingBookingData._id,
        guestName: formValues.guest_name,
        checkInDate: formValues.checkInDate,
        checkOutDate: formValues.checkOutDate,
        roomCategory: formValues.roomCategory,
        numberOfRooms: formValues.nor,
        numberOfPersons: formValues.nop,
        bookingAmount: formValues.bookingAmount.trim(),
        advanceAmount: formValues.advanceAmount.trim(),
        dueAmount: formValues.dueamount,
        advanceDate: formValues.Advancedate,
        bookingSource: formValues.bookingSource,
        booikingBy: formValues.bb,
        accountType: formValues.accountType,
        plan: formValues.plan,
        contactNumber: formValues.cn.trim(),
        remarks: formValues.remark,
        guestEmail: formValues.guestEmail,
      });
      if (!data.error) {
        // const { data } = await axios.post("/user/get-users");
        const bookingIndex = bookingData.findIndex(
          (hotel: any) => hotel._id === editingBookingDataProps._id
        );

        // If the user is found in the array, replace the data at that index
        if (bookingIndex !== -1) {
          setBookingData((prev: any) => {
            const updatedBookingData = [...prev];
            updatedBookingData[bookingIndex] = data.user;
            return updatedBookingData;
          });
        }

        onClose(false);

        toast.success(data.message);
        formRef.current?.reset();
      } else {
        toast.error(data.error);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <form
      onSubmit={handleUpdate}
      className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl  "
    >
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
          <div>
            <label
              htmlFor="hotel"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Hotel Name
            </label>
            <input
              disabled
              type="text"
              id="hotel"
              name="hotel"
              value={editingBookingData.hotel.hotelName || "Deleted hotel"}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="guest_name"
              className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Guest Name <span className="text-red-500">*</span>
            </label>
            <input
              value={editingBookingData.guestName}
              type="text"
              id="guest_name"
              name="guest_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              onChange={(e) => {
                setEditingBookingData((prev: any) => {
                  return {
                    ...prev,
                    guestName: e.target.value.toLocaleUpperCase(),
                  };
                });
              }}
            />
          </div>
          <div>
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={phoneNumber}
              onChange={handleContactChange}
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
              value={checkInDate}
              id="startDate"
              name="checkInDate"
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              min={
                owner.role !== "ADMIN"
                  ? editingBookingData.checkInDate.split("T")[0]
                  : ""
              }
              onChange={handleCheckInDateChange}
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
              id="endDate"
              name="checkOutDate"
              type="date"
              value={checkOutDate}
              required
              min={editingBookingData.checkInDate.split("T")[0]}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleCheckOutDateChange}
            />
          </div>

          <div>
            <label
              htmlFor="nor"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Number of Room <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="nor"
              name="nor"
              className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return { ...prev, numberOfRooms: String(e.target.value) };
                })
              }
              value={editingBookingData.numberOfRooms}
            />
          </div>
          <div>
            <label
              htmlFor="nop"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Number of Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nop"
              name="nop"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={editingBookingData.numberOfPersons}
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return { ...prev, numberOfPersons: e.target.value };
                })
              }
            />
          </div>
          <div>
            <label
              htmlFor="roomCategory"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Room Category <span className="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              name="roomCategory"
              type="text"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={editingBookingData.roomCategory}
              onChange={handleRoomCategoryChange}
            />
          </div>
          <div>
            <label
              htmlFor="plan"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Plan <span className="text-red-500">*</span>
            </label>
            <select
              required
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return { ...prev, plan: e.target.value };
                })
              }
              id="plan"
              name="plan"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option
                defaultValue={editingBookingData.plan}
                value={editingBookingData.plan}
              >
                {editingBookingData.plan}
              </option>
              <option value="AP">AP</option>
              <option value="CP">CP</option>
              <option value="MAP">MAP</option>
              <option value="EP">EP</option>
            </select>
          </div>
          <div className="">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Booking Amount <span className="text-red-500">*</span>
            </label>
            <input
              name="bookingAmount"
              type="number"
              id="bookingAmount"
              value={editingBookingData.bookingAmount}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return {
                    ...prev,
                    bookingAmount: e.target.value,
                    dueAmount:
                      parseInt(e.target.value) -
                      editingBookingData.advanceAmount,
                  };
                })
              }
            />
          </div>
          <div className="">
            <label
              htmlFor="da"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Advance Amount <span className="text-red-500">*</span>
            </label>
            <input
              name="advanceAmount"
              type="number"
              id="advanceAmount"
              value={editingBookingData.advanceAmount}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return {
                    ...prev,
                    advanceAmount: e.target.value,
                    dueAmount:
                      editingBookingData.bookingAmount -
                      parseInt(e.target.value),
                  };
                })
              }
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
              type="number"
              value={editingBookingData.dueAmount}
              readOnly
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="ad"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Advance Date <span className="text-red-500">*</span>
            </label>
            <input
              value={advanceDate}
              id="Advancedate"
              name="Advancedate"
              type="date"
              max={editingBookingData.checkInDate.split("T")[0]}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              onChange={handleAdvanceDateChange}
            />
          </div>
          <div>
            <label
              htmlFor="ad"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Booking source <span className="text-red-500">*</span>
            </label>
            <select
              required
              id="paymentby"
              name="bookingSource"
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return { ...prev, bookingSource: e.target.value };
                })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value={editingBookingData.bookingSource}>
                {editingBookingData.bookingSource}
              </option>
              <option value="Sayngo">SAYNGO</option>
              <option value="Booking.com">Booking.com</option>
              <option value="Agoda">Agoda</option>
              <option value="Cleartrip">Cleartrip</option>
              <option value="Yatra">Yatra</option>
              <option value="Travel Agent">Travel Agent</option>
              <option value="Via.com">Via.com</option>
              <option value="Paytm">Paytm</option>
              <option value="Lxiogo">Lxiogo</option>
              <option value="GoMMT">GoMMT</option>
              <option value="Expedia">Expedia</option>
              <option value="Travelguru">Travelguru</option>
              <option value="EaseMyTrip">EaseMyTrip</option>
              <option value="Book on Google">Book on Google</option>
              <option value="HappyEasyGo">HappyEasyGo</option>
            </select>
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
              disabled
              value={editingBookingData.bookingBy}
            />
          </div>
          <div>
            <label
              htmlFor="plan"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Account type <span className="text-red-500">*</span>
            </label>
            <select
              required
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return { ...prev, accountType: e.target.value };
                })
              }
              id="plan"
              name="accountType"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value={editingBookingData.accountType}>
                {editingBookingData.accountType}
              </option>

              <option value="HOTEL">HOTEL</option>
              <option value="SAYNGO">SAYNGO</option>
            </select>
          </div>

          <div className="">
            <label
              htmlFor="bb"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Guest Email (Optional)
            </label>
            <input
              type="email"
              id="bb"
              name="guestEmail"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return { ...prev, guestEmail: e.target.value };
                })
              }
              value={editingBookingData.guestEmail}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="remark"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Remarks (Optional)
            </label>
            <textarea
              value={editingBookingData.remarks}
              id="remark"
              name="remark"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setEditingBookingData((prev: any) => {
                  return {
                    ...prev,
                    remarks: e.target.value.toLocaleUpperCase(),
                  };
                })
              }
            />
          </div>
        </div>
        <button type="submit" className="defaultBtn" disabled={loading}>
          Update
        </button>
        {/* <button
        type="reset"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
        disabled={loading}
      >
        Reset
      </button> */}
      </TailwindWrapper>
    </form>
  );
};

export default EditBooking;
