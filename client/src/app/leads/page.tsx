"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Table from "@/components/Table/Table";
import LeadsTable from "@/components/Table/LeadsTable";
import InputEmp from "@/components/card/InputEmp";
import LeadsInput from "@/components/card/LeadsInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/utils/axios";
import { FaPlus } from "react-icons/fa";
import { fetchOwner } from "@/utils";
import ViewUser from "@/components/card/ViewUsers";
import { BiLink, BiSearch } from "react-icons/bi";
import { FcNext, FcPrevious } from "react-icons/fc";
import { CiSquareRemove } from "react-icons/ci";
import ViewLead from "@/components/card/ViewLead";
import { FRONTEND_URL } from "@/constants/constant";
import EditLead from "@/components/card/EditLead";

const Leads = () => {
  let router = useRouter();
  const PAGE_LIMIT = 10;
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState(""); // {users: [], usersCount: 0}
  const [owner, setOwner] = useState<any>({});
  const [accountType, setAccountType] = useState<string>("");
  const [leadsData, setLeadsData] = useState<any>([]);
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [lead, setLead] = useState<object>({});
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<boolean>(false);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingLeadsData, setEditingLeadsData] = useState<object>({});

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

      if (user && user._id && user.isActive) {
        setOwner(user);
        localStorage.setItem("user", JSON.stringify(user));
        setAccountType(user?.role);
      } else {
        toast.error("You are not authorized to view this page");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");

        window.open(`${FRONTEND_URL}/login`, "_self");
      }
    };
    updateUser();
  }, []);

  const getLeadsBySearch = async (e?: any) => {
    e && e.preventDefault();
    try {
      if (searchText?.trim()?.length > 0) {
        let { data } = await axios.get(
          `/leads/get-leads/search?&query=${searchText}`
        );
        // console.log("forms", data);
        if (!data.error) {
          // setSearchResults(data);
          setLeadsData(data.leads);
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.log("Error getting leads", error);
    }
  };

  useEffect(() => {
    const getLeads = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/leads/get-leads?page=${page}&limit=${PAGE_LIMIT}`
        );
        // console.log(data);
        if (!data.error) {
          setLeadsData(data.leads);
          setLeadsCount(data.leadsCount);
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

    searchText.trim().length > 0 ? getLeadsBySearch() : getLeads();
  }, [page, PAGE_LIMIT, reloadData]);

  const confirmLeadHandler = async (id?: string) => {
    try {
      // setUpdating(true);
      const { data } = await axios.post("/leads/confirm-lead", {
        leadId: id,
      });
      if (!data.error) {
        // const { data } = await axios.post("/user/get-users");
        const leadIndex = leadsData.findIndex((lead: any) => lead._id === id);

        // If the user is found in the array, replace the data at that index
        if (leadIndex !== -1) {
          setLeadsData((prev: any) => {
            const updatedLeadData = [...prev];
            updatedLeadData[leadIndex] = data.lead;
            return updatedLeadData;
          });
        }
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
      // setUpdating(false);
    } catch (error: any) {
      // setUpdating(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col justify-center gap-4 items-center overflow-hidden">
        <div className="flex w-full justify-between mt-6 items-center gap-4 lg:gap-0">
          <h1 className="text-2xl font-bold">Leads Generator</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              type="submit"
              className=" defaultBtn"
            >
              <FaPlus size={20} />
              <p className="whitespace-nowrap text-sm hidden lg:block">
                Generate Leads
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
              disabled={page * PAGE_LIMIT >= leadsCount}
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
            getLeadsBySearch(e);

            // toast.info("Search feature is not available yet");
          }}
          className="w-full h-full text-xs md:mt-0"
        >
          <div className="ml-auto border shadow md:w-[500px] mx-1 h-full flex flex-row rounded-md justify-center items-center overflow-hidden">
            <input
              placeholder="Search Leads..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-full py-4 px-4 dark:bg-[#282f46] outline-none text-gray-700 dark:text-white"
            />
            <button
              className="min-w-[40px] flex justify-center items-center defaultBtn"
              onClick={(e) => {
                getLeadsBySearch(e);
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
          <LeadsTable
            setShowModal={(value) => setShowViewModal(value)}
            getLeads={(lead) => setLead(lead)}
            leadsData={leadsData}
            setLeadsData={setLeadsData}
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
          <ViewLead
            setShowEditModal={(value) => setShowEditModal(value)}
            setEditingLeadsData={(value) => setEditingLeadsData(value)}
            confirmLeadHandler={confirmLeadHandler}
            owner={owner}
            onClose={(value) => setShowViewModal(value)}
            lead={lead}
          />
        </div>
      )}
      {showEditModal && editingLeadsData && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <EditLead
            onClose={(value) => setShowEditModal(value)}
            setLeadData={setLeadsData}
            editingLeadDataProps={editingLeadsData}
            leadData={leadsData}
            owner={owner}
          />
        </div>
      )}
      {showModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <LeadsInput
            onClose={(value) => setShowModal(value)}
            setLeadsData={setLeadsData}
          />
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
            disabled={page * PAGE_LIMIT >= leadsCount}
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="text-gray-500 text-sm">
          {" "}
          <div>{`Page ${page} of ${Math.ceil(leadsCount / PAGE_LIMIT)}`}</div>
        </div>
      </div>
    </>
  );
};

export default Leads;
