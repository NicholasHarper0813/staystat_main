"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Table from "@/components/Table/Table";
import InputEmp from "@/components/card/InputEmp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/utils/axios";
import { FaPlus, FaTimes } from "react-icons/fa";
import { fetchOwner } from "@/utils";
import ViewUser from "@/components/card/ViewUsers";
import { BiLink, BiSearch } from "react-icons/bi";
import { FcNext, FcPrevious } from "react-icons/fc";
import { CiSquareRemove } from "react-icons/ci";
import { SiMicrosoftexcel } from "react-icons/si";
import { utils, writeFile } from "xlsx";
import { FRONTEND_URL } from "@/constants/constant";
import EditUser from "@/components/card/EditUser";

const Users = () => {
  let router = useRouter();
  const PAGE_LIMIT = 10;
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState(""); // {users: [], usersCount: 0}
  const [owner, setOwner] = useState<any>({});
  const [accountType, setAccountType] = useState<string>("");
  const [userData, setUserData] = useState<any>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [user, setUser] = useState<object>({});
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [showDownloadPopUp, setShowDownloadPopUp] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingUserData, setEditingUserData] = useState<any>({});

  useEffect(() => {
    if (showModal || showViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showViewModal, showModal]);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
    let updateUser = async () => {
      const user = await fetchOwner(userId);

      if (user.role !== "ADMIN") {
        window.location.href = "/bookings";
      }
      if (user && user._id && user.isActive) {
        setOwner(user);
        localStorage.setItem("user", JSON.stringify(user));
        setAccountType(user?.role);
      } else {
        toast.error("You are not authorized to view this page");
        localStorage.removeItem("user");
        window.open(`${FRONTEND_URL}/login`, "_self");
      }
    };
    updateUser();
  }, []);

  const getUsersBySearch = async (e?: any) => {
    e && e.preventDefault();
    try {
      if (searchText?.trim()?.length > 0) {
        let { data } = await axios.get(
          `/user/get-users/search?&query=${searchText}`
        );
        // console.log("forms", data);
        if (!data.error) {
          // setSearchResults(data);
          setUserData(data.users);
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.log("Error getting forms", error);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/user/get-users?page=${page}&limit=${PAGE_LIMIT}`
        );
        // console.log(data);
        if (!data.error) {
          setUserData(data.users);
          setUsersCount(data.usersCount);
        } else {
          toast.error(data.error);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      }
    };

    searchText.trim().length > 0 ? getUsersBySearch() : getUsers();
  }, [page, PAGE_LIMIT, reloadData]);

  const deleteUserHandler = async (id?: string) => {
    try {
      const { data } = await axios.post(`/user/delete-user`, {
        id,
      });
      if (!data.error) {
        toast.success(data.message);
        const { data: users } = await axios.get(
          `/user/get-users?page=${page}&limit=${PAGE_LIMIT}`
        );
        if (!data.error) {
          setUserData(users.users);
          setUsersCount(users.usersCount);
        } else {
          toast.error(data.error);
        }
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const updateStatusHandler = async (id?: string) => {
    try {
      const { data } = await axios.post(`/user/update-user-status`, {
        id,
      });
      if (!data.error) {
        toast.success(data.message);
        const { data: users } = await axios.get(
          `/user/get-users?page=${page}&limit=${PAGE_LIMIT}`
        );
        if (!data.error) {
          setUserData(users.users);
          setUsersCount(users.usersCount);
        } else {
          toast.error(data.error);
        }
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleDownload = async () => {
    const getUsersForDownload = async () => {
      try {
        const { data } = await axios.get(`/user/get-users`);
        // console.log(data);
        if (!data.error) {
          return data.users;
        } else {
          toast.error(data.error);
          return;
        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      }
    };
    let userDataForDownload = await getUsersForDownload();
    let userDataForExcel = userDataForDownload.map((user: any) => {
      return {
        "Serial Number": user?.serialNumber,
        Name: user?.name,
        Username: user?.username,
        Email: user?.email,
        "Phone Number": user?.phoneNumber,
        Role: user?.role,
        Hotels: user?.hotel?.map((hotel: any) => hotel?.hotelName).join(", "),
        Status: user?.isActive ? "active" : "inactive",
      };
    });

    const worksheet = utils.json_to_sheet(userDataForExcel);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(
      workbook,
      `Users-${
        owner?.name || owner?.username
      }-${new Date().toDateString()}.xlsx`
    );
  };

  return (
    <>
      <div className="flex w-full flex-col justify-center gap-4 items-center overflow-hidden">
        <div className="flex w-full justify-between mt-6">
          <h1 className="text-2xl font-bold">User Details</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowDownloadPopUp(true);
              }}
              className="defaultBtn"
            >
              <SiMicrosoftexcel size={20} />
              <p className="whitespace-nowrap text-sm hidden lg:block">
                Download Excel
              </p>
            </button>
            <button
              onClick={() => setShowModal(true)}
              type="submit"
              className="defaultBtn "
            >
              <FaPlus size={20} />
              <p className="whitespace-nowrap text-sm hidden lg:block">
                Add User
              </p>
            </button>
          </div>
        </div>
        <div className="md:h-[40px] my-4 sm:my-6 text-gray-600 flex flex-row justify-center gap-2 md:flex-row items-center w-full">
        <div className="h-full flex flex-row  items-center mr-auto">
          <div className="flex flex-row h-full text-gray-700">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="border p-3 shadow hover:bg-gray-200 cursor-pointer hover:opacity-90 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcPrevious />
            </button>
            <button
              disabled={page * PAGE_LIMIT >= usersCount}
              onClick={() => setPage(page + 1)}
              className="border p-3 shadow hover:bg-gray-200 cursor-pointer hover:opacity-90 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcNext />
            </button>
          </div>
          {/* <div className="ml-4 py-2 px-2 h-full border shadow rounded text-xs font-medium"> */}
          {/* <Select
              id="hotel"
              name="hotel"
              options={[
                { value: "all", label: "All Users" },
                ...userData.map((user: any) => ({
                  value: user._id,
                  label: user.username,
                })),
              ]}
              isMulti
              value={"coming soon"}
              onChange={() => {
                toast.info("Search feature is not available yet");
                // handleHotelSelection()
              }}
              className="w-[80px] outline-none ml-4 px-2 h-full shadow rounded text-xs font-medium"
              isDisabled={loading}
            /> */}
          {/* </div> */}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getUsersBySearch(e);

            // toast.info("Search feature is not available yet");
          }}
          className="w-full h-full text-xs md:mt-0"
        >
          <div className="ml-auto border shadow md:w-[500px] mx-1 h-full flex flex-row rounded-md justify-center items-center overflow-hidden">
            <input
              placeholder="Search Users..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-full py-4 px-4 dark:bg-[#282f46] outline-none text-gray-700 dark:text-white"
            />
            <button
              className="min-w-[40px] flex justify-center items-center defaultBtn"
              onClick={(e) => {
                getUsersBySearch(e);
                // e.preventDefault();
                // toast.info("Search feature is not available yet");
              }}
            >
              <BiSearch className="text-xl" />
            </button>
            <div className="min-w-[40px] flex items-center justify-center">
              <CiSquareRemove
                size={40}
                className=" text-red-500 cursor-pointer"
                onClick={() => {
                  setSearchText("");
                  setReloadData(!reloadData);
                }}
              />
            </div>
          </div>
        </form>
      </div>
        <div className="flex w-full">
          <Table
            setShowModal={(value) => setShowViewModal(value)}
            getUser={(user) => setUser(user)}
            userData={userData}
            setUserData={setUserData}
            deleteUserHandler={deleteUserHandler}
            updateStatusHandler={updateStatusHandler}
            owner={owner}
            loading={loading}
          />
        </div>
        <ToastContainer
          theme="dark"
          position="bottom-center"
          autoClose={10000}
        />
      </div>
      {showViewModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <ViewUser
            setShowEditModal={(value) => setShowEditModal(value)}
            setEditingUserData={(value) => setEditingUserData(value)}
            deleteUserHandler={deleteUserHandler}
            updateStatusHandler={updateStatusHandler}
            owner={owner}
            onClose={(value) => setShowViewModal(value)}
            user={user}
          />
        </div>
      )}
      {showEditModal && editingUserData && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden z-50">
          <EditUser
            onClose={(value) => setShowEditModal(value)}
            setUserData={setUserData}
            editingUserDataProps={editingUserData}
            userData={userData}
          />
        </div>
      )}
      {showModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          {accountType === "ADMIN" && (
            <InputEmp
              onClose={(value) => setShowModal(value)}
              setUserData={setUserData}
            />
          )}
        </div>
      )}
      <div className="z-20 w-full flex flex-row justify-between items-center py-3">
        <div>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mr-2 py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page * PAGE_LIMIT >= usersCount}
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="text-gray-500 text-sm">
          {" "}
          <div>{`Page ${page} of ${Math.ceil(usersCount / PAGE_LIMIT)}`}</div>
        </div>
      </div>
      {showDownloadPopUp && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden z-50">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">
                Downlod data in a Excel file
              </h1>
              <button
                disabled={downloading}
                onClick={() => setShowDownloadPopUp(false)}
                className="text-red-500 text-lg disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to download?
            </p>
            <span className="text-sm text-gray-500 mt-2">
              This might take some time!
            </span>
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowDownloadPopUp(false)}
                className="text-sm text-white rounded-md bg-gray-500 mr-4 p-2 disabled:opacity-50"
                disabled={downloading}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setDownloading(true);
                  await handleDownload();
                  setDownloading(false);
                  setShowDownloadPopUp(false);
                }}
                className="text-sm text-white font-semibold rounded-md bg-indigo-500 p-2 disabled:opacity-50"
                disabled={downloading}
              >
                {downloading ? "Downloading" : "Download"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
