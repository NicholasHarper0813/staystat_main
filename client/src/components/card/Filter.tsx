"use client";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import axios from "@/utils/axios";

type Props = {
  usersData: any;
  setStayColor: any;
  setFilterData: any;
  isFilterOpen: boolean;
  bookingStats: {
    totalBookingAmt: number;
    totalAdvanceAmt: number;
    totalDueAmt: number;
  };
};
// Function to remove time from a date

const Filter = ({
  usersData,
  setStayColor,
  setFilterData,
  isFilterOpen,
  bookingStats,
}: Props) => {
  const [hotels, setHotels] = React.useState<any>([]);
  const [users, setUsers] = React.useState<any>([]);
  console.log(JSON.stringify(usersData.hotel) + "main-users");

  const [filter, setFilter] = useState({
    guestName: "",
    hotelName: "--select--",
    bookingSource: "--select--",
    serialNumber: "",
    filterBy: "--select--",
    status: "--select--",
    addedBy: "--select--",
    dateRange: {},
  });

  const [stayHotels, setStayHotels] = useState({
    hotelName: "--select--",
  });
  const [isFilterOptionSelected, setisFilterOptionSelected] =
    useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectionRange, setSelectionRange] = React.useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  useEffect(() => {
    const getHotels = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(`/hotel/get-all-hotels`);
        const { data: users } = await axios.get(`/user/get-all-users`);

        if (!data.error) {
          setHotels(data.hotels);
          setUsers(users.users);
        } else {
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.log(error);
      }
    };
    getHotels();
  }, []);

  const handleSelect = (ranges: any) => {
    const startDate = new Date(ranges.selection.startDate);
    const endDate = new Date(ranges.selection.endDate);

    startDate.setMinutes(
      startDate.getMinutes() - startDate.getTimezoneOffset(),
    );
    endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());

    setSelectionRange({ startDate, endDate, key: "selection" });

    setFilter({
      ...filter,
      dateRange: {
        startDate: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          0,
          0,
          0,
        ),
        endDate: new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59,
        ),
      },
    });
  };

  const handleSubmit = () => {
    setFilterData(filter);
  };

  console.log(stayHotels.hotelName + "selected hotel");
  if (isFilterOpen) {
    return (
      <>
        <div className="rounded-md w-full flex-wrap flex justify-start items-start p-4 flex-col">
          <div className="flex  justify-between w-full lg:flex-row flex-col gap-4">
            <div className="flex flex-col gap-4 justify-start items-start">
              <div className="flex lg:justify-center lg:items-center gap-2 flex-wrap">
                <div className="">
                  <label htmlFor="" className="whitespace-nowrap">
                    Guest name
                  </label>
                  <input
                    value={filter.guestName}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        guestName: e.target.value.toLocaleUpperCase(),
                      });
                    }}
                    placeholder="Enter guest name"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                {usersData.role === "ADMIN" ? (
                  <div className="">
                    <label htmlFor="" className="whitespace-nowrap">
                      Hotel name
                    </label>
                    <select
                      onChange={(e) => {
                        setFilter({ ...filter, hotelName: e.target.value });
                      }}
                      name=""
                      id="hotel-drop-down"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={filter.hotelName && filter.hotelName}
                    >
                      <option disabled selected value={"--select--"}>
                        --Select--
                      </option>
                      {hotels.map((hotel: any, index: any) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.hotelName}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="">
                    <label htmlFor="" className="whitespace-nowrap">
                      Hotel name
                    </label>
                    <select
                      onChange={(e) => {
                        setFilter({ ...filter, hotelName: e.target.value });
                      }}
                      name=""
                      id="hotel-drop-down"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={filter.hotelName && filter.hotelName}
                    >
                      <option disabled selected value={"--select--"}>
                        --Select--
                      </option>
                      {usersData.hotel.map((hotel: any, index: any) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.hotelName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="">
                  <label htmlFor="" className="whitespace-nowrap">
                    Booking source
                  </label>
                  <select
                    onChange={(e) => {
                      setFilter({ ...filter, bookingSource: e.target.value });
                    }}
                    id="source-drop-down"
                    name=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={filter.bookingSource}
                  >
                    <option disabled selected value={"--select--"}>
                      --Select--
                    </option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Agoda">Agoda</option>
                    <option value="Cleartrip">Cleartrip</option>
                    <option value="Yatra">Yatra</option>
                    <option value="Sayngo">Sayngo</option>
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
              </div>
              <div className="flex lg:justify-center lg:items-center gap-2 flex-wrap">
                <div>
                  <label htmlFor="" className="whitespace-nowrap">
                    Sl. no
                  </label>
                  <input
                    onChange={(e) => {
                      setFilter({ ...filter, serialNumber: e.target.value });
                    }}
                    type="number"
                    value={filter.serialNumber}
                    placeholder="Enter serial number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                {usersData.role === "ADMIN" ? (
                  <div className="">
                    <label htmlFor="" className="whitespace-nowrap">
                      Added By
                    </label>
                    <select
                      onChange={(e) => {
                        setFilter({ ...filter, addedBy: e.target.value });
                      }}
                      name=""
                      id="hotel-drop-down"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={filter.addedBy && filter.addedBy}
                    >
                      <option disabled selected value={"--select--"}>
                        --Select--
                      </option>
                      {users.map((user: any, index: any) => (
                        <option key={user._id} value={user._id}>
                          {user.name || user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="">
                    <label htmlFor="" className="whitespace-nowrap">
                      Added By
                    </label>
                    <select
                      disabled
                      name=""
                      id="hotel-drop-down"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={usersData._id}
                    >
                      <option value={usersData._id}>
                        {usersData.name || usersData.username}
                      </option>
                    </select>
                  </div>
                )}
                <div className="">
                  {" "}
                  <h1>Status</h1>
                  <select
                    onChange={(e) => {
                      setisFilterOptionSelected(true);
                      setFilter({ ...filter, status: e.target.value });
                    }}
                    name=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={filter.status && filter.status}
                  >
                    <option disabled selected value={"--select--"}>
                      --Select--
                    </option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div className="">
                  {" "}
                  <h1>Date Range By</h1>
                  <select
                    onChange={(e) => {
                      setisFilterOptionSelected(true);
                      setFilter({ ...filter, filterBy: e.target.value });
                    }}
                    name=""
                    id="filterBy-drop-down"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={filter.filterBy && filter.filterBy}
                  >
                    <option disabled selected value={"--select--"}>
                      --Select--
                    </option>
                    <option value="createdAt">Created</option>
                    <option value="checkInDate">Arrival</option>

                    <option value="checkOutDate">Departure</option>
                    <option value="status">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            {isFilterOptionSelected && (
              <div className="flex overflow-y-scroll no-scrollbar flex-col gap-2">
                <h1 className="mb-2 font-bold">Select date range</h1>
                <DateRangePicker
                  className=" text-blue-600 rounded-xl dark:bg-gray-800"
                  showMonthAndYearPickers={true}
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                />
              </div>
            )}
          </div>

          {isFilterOpen && (
            <div className="mt-2 flex gap-2 flex-col">
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  disabled={
                    !filter.guestName &&
                    filter.hotelName === "--select--" &&
                    filter.bookingSource === "--select--" &&
                    !filter.serialNumber &&
                    filter.filterBy === "--select--" &&
                    filter.status === "--select--" &&
                    filter.addedBy === "--select--"
                  }
                  className="defaultBtn"
                >
                  Search
                </Button>

                <Button
                  onClick={() => {
                    setisFilterOptionSelected(false);

                    setStayHotels({
                      hotelName: "--select--",
                    });

                    setFilter({
                      guestName: "",
                      hotelName: "--select--",
                      bookingSource: "--select--",
                      serialNumber: "",
                      filterBy: "--select--",
                      dateRange: {},
                      status: "--select--",
                      addedBy: "--select--",
                    });
                    setStayColor(false);
                    setFilterData({
                      guestName: "",
                      hotelName: "",
                      bookingSource: "",
                      serialNumber: "",
                      filterBy: "",
                      dateRange: {},
                      status: "",
                      addedBy: "",
                    });
                  }}
                  type="submit"
                  className="defaultBtn"
                >
                  Reset
                </Button>
              </div>

              <div className="flex flex-col justify-center items-start">
                <div className="flex lg:flex-row flex-col gap-4">
                  <p>
                    Total Booking Amount - ₹{" "}
                    {Math.floor(bookingStats.totalBookingAmt)}
                  </p>
                  <h1 className="hidden lg:block"> | </h1>
                  <p>
                    Total Advance Amount - ₹{" "}
                    {Math.floor(bookingStats.totalAdvanceAmt)}
                  </p>

                  <h1 className="hidden lg:block"> | </h1>

                  <p>
                    Total Due Amount - ₹ {Math.floor(bookingStats.totalDueAmt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  } else {
    return <div></div>;
  }
};

export default Filter;
