"use client";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdFileDownloadDone, MdWarningAmber } from "react-icons/md";
import { TbLoader } from "react-icons/tb";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import EditHotel from "../card/EditHotel";
import { InfinitySpin } from "react-loader-spinner";
import EditWorks from "@/components/card/EditWorks";
import { Button } from "flowbite-react";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
interface TableProps {
  workData: {
    userName?: { name: string; _id: string; userName: string };
    workDetails?: string;
    finishDeadline?: string;
    updatedAt?: string;
    workConfirm?: string;
    serialNumber?: string;
  }[];

  setWorkData: any;
  getWork: (work: object) => void;
  setShowModal: (value: boolean) => void;
  deleteWorkHandler: (id: string) => void;
  statusUpdateHandler: (id: string, action: string,remakrs: string) => void;
  owner?: any;
  loading?: boolean;
}

const WorksTable = ({
  workData,
  setWorkData,
  getWork,
  setShowModal,
  deleteWorkHandler,
  statusUpdateHandler,
  owner,
  loading,
}: TableProps) => {
  const [showEditWorkModal, setShowEditWorkModal] = useState<boolean>(false);
  const [editingWorkData, setEditingWorkData] = useState<object>({});
  const [showDeletePopup, setShowDeletePopUp] = useState<boolean>(false);
  const [showRemarksPopup, setShowRemarksPopup] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [workId, setWorkId] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");


  useEffect(() => {
    console.log(workData)
    if (showEditWorkModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showEditWorkModal, showDeletePopup, showRemarksPopup]);


  const handleShowDeleteModal = (id: string) => {
    setWorkId(id);

    setShowDeletePopUp(true);
  };

 
  const showAcceptModal = (id: string, action: string) => {

    setShowRemarksPopup(true);
    setWorkId(id);
    setAction(action);
  };

  const showRejectModal = (id: string, action: string) => {
    setShowRemarksPopup(true);
    setWorkId(id);
    setAction(action);
  };

  return (
    <div className="w-full">
      <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg cursor-pointer">
      <table className="w-full border border-gray-600/25 dark:border-gray-300/25 rounded-md text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
          <thead className="text-xs text-gray-900 uppercase dark:bg-gray-700 dark:text-gray-400 border">
          <tr className="whitespace-nowrap">
              <th scope="col" className="px-6 py-3 text-center">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                User Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Work Details
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Modified Date
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Finish Deadline
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Remarks
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Options
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl dark:text-white">
            {workData.length === 0 && (
              <tr className=" border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <TbLoader className="text-4xl text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </tr>
            )}

            {workData.length > 0 && (
              <>
                {loading ? (
                  <div className=" m-auto">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  workData && workData.map((work: any, index: number) => {
                      // console.log(work);


                    if( work?.userName?._id === owner?._id){
                      
                      return (
                        <tr

                          key={index}
                          className={` border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${work.workConfirm === "CONFIRMED" ? "text-green-500" : work.workConfirm === "REJECTED" ? "text-red-500 line-through" : ""}`}
                        >
                          
                          <th
                            scope="row"
                            className="text-center px-6 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                          >
                            {work.serialNumber || ""}
                          </th>
                          <td className="px-6 py-2 text-center">
                            {work.userName.name || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {work.workDetails || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {new Date(work.updatedAt).toDateString() || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {work.workConfirm || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {new Date(work.finishDeadline).toDateString() || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {work.remarks || "no remarks"}
                          </td>
  
                          <td className="px-6 py-2 text-center">
                            {owner?._id === work?.userName?._id ? (
                              <div className="flex gap-2 w-full justify-center items-center">
                                <button
                                  disabled={work.workConfirm === "CONFIRMED" || work.workConfirm === "REJECTED"}
                                  onClick={() => {
                                    showAcceptModal(work._id, "CONFIRMED");
                                  }}
                                  data-tip={"update Lead"}
                                  className={`${work.workConfirm === "REJECTED" && "text-red-500"} w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                                >
                                  {
                                    work.workConfirm === "CONFIRMED" ? (
                                      <MdFileDownloadDone
                                    size={20}
                                    className="inline-block"
                                  />
                                    ) : (
                                      <MdWarningAmber
                                    size={20}
                                    className="inline-block"
                                  />
                                    )
                                  }
                                  {work.workConfirm === "CONFIRMED" ? "Accepted" : work.workConfirm === "REJECTED" ? "Rejected" : "Accept"}
                                </button>
                                
                                {
                                  work.workConfirm === "PENDING" && (
                                    <>
                                    <button
                                disabled={work.workConfirm === "CONFIRMED" || work.workConfirm === "REJECTED"}
                                onClick={() => showRejectModal(work._id, "REJECTED")}
                                  
                                  data-tip={"update Lead"}
                                  className={`w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                                >
                                  <MdFileDownloadDone
                                    size={20}
                                    className="inline-block"
                                  />{" "}
                                  Reject
                                </button>
                                <button
                                  // disabled={work.createdBy._id !== owner._id}
                                  data-tip={"Preview Link"}
                                  onClick={() => {
                                    // console.log("chal nubbb" + work);
                                    getWork(work);
                                    setShowModal(true);
                                  }}
                                  className={`w-fit text-center p-2 shadow border bg-gray-100 text-blue-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                                >
                                  <AiOutlineEye className="" />
                                </button>
                                    </>
                                
                                  )
                                }
                              </div>
                            ): (
                              <p>No Actions Available</p>
                            )}
                          </td>
                        </tr>
                      );
                    } else if (owner.role === "ADMIN") {
                      return (
                        <tr
                        onClick={() => {
                          // console.log( work);
                          getWork(work);
                          setShowModal(true);
                        }}
                        // @ts-ignore
                        
                          key={index}
                          className={` border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${work.workConfirm === "CONFIRMED" ? "text-green-500" : work.workConfirm === "REJECTED" ? "text-red-500 line-through" : ""}`}
                        >
                         

                         
                          <th
                            scope="row"
                            className="text-center px-6 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                          >
                            {work.serialNumber || ""}
                          </th>
                          <td className="px-6 py-2 text-center">
                            {work.userName.name || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {work.workDetails.length > 50 ? work.workDetails.substring(0,50) + "...": work.workDetails || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {new Date(work.updatedAt).toDateString() || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {work.workConfirm || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {new Date(work.finishDeadline).toDateString() || ""}
                          </td>
                          <td className="px-6 py-2 text-center">
                            {work.remarks?.length > 50 ? work.remarks?.substring(0,50) + "..." : work.remarks || "no remarks"}
                          </td>
                          <td className="px-6 py-2 text-center">
                            No Actions Available
                          </td>
                         
  
                          {/* <td className="px-6 py-2 text-center">
                            {owner.role !== "SUBADMIN" ? (
                              <div className="flex justify-center items-center">
                                <button
                                  // disabled={work.createdBy._id !== owner._id}
                                  data-tip={"Preview Link"}
                                  onClick={() => {
                                    // console.log("chal nubbb" + work);
                                    getWork(work);
                                    setShowModal(true);
                                  }}
                                  className={`w-fit text-center p-2 shadow border bg-gray-100 text-blue-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                                >
                                  <AiOutlineEye className="" />
                                </button>
                                <button
                                  disabled={
                                    work.createdBy._id !== owner._id &&
                                    owner.role !== "ADMIN"
                                  }
                                  // data-tip={"Preview Link"}
                                  onClick={() => {
                                    setShowEditWorkModal(true);
                                    setEditingWorkData(work);
                                  }}
                                  className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                                >
                                  <FiEdit className="" />
                                </button>
                                <button
                                  disabled={
                                    work.createdBy._id !== owner._id &&
                                    owner.role !== "ADMIN"
                                  }
                                  data-tip={"Delete Hotel"}
                                  onClick={() => {
                                    handleShowDeleteModal(work._id);
                                  }}
                                  className={`w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
                                >
                                  <RiDeleteBin6Line size={15} className="" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  // disabled={user.addedBy !== owner._id}
                                  onClick={() => {
                                    showAcceptModal(work._id, "CONFIRMED");
                                  }}
                                  data-tip={"update Lead"}
                                  className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                                >
                                  <MdFileDownloadDone
                                    size={20}
                                    className="inline-block"
                                  />{" "}
                                  Accept
                                </button>
                                <button
                                  // disabled={user.addedBy !== owner._id}
                                  onClick={() => showRejectModal(work._id, "REJECTED")}
                                  data-tip={"update Lead"}
                                  className={`w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                                >
                                  <MdFileDownloadDone
                                    size={20}
                                    className="inline-block"
                                  />{" "}
                                  Reject
                                </button>
                              </div>
                            )}
                          </td> */}
                        </tr>
                      );

                    }

                  })
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      {showEditWorkModal && editingWorkData && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <EditWorks
            onClose={(value) => setShowEditWorkModal(value)}
            setWorkData={setWorkData}
            editingWorkDataProps={editingWorkData}
            workData={workData}
          />
        </div>
      )}
      {showDeletePopup && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Delete Work</h1>
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this work?
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
                  deleteWorkHandler(workId);
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
      {
        showRemarksPopup && (
          <div className=" z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg dark:text-black font-bold">Accept / Reject</h1>
              <button
                onClick={() => setShowRemarksPopup(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Please enter remarks here!
            </p>
            <textarea placeholder="Enter remarks" required onChange={(e) => setRemarks(e.target.value)}  className="w-full rounded-xl mt-2 dark:bg-white dark:text-black dark:border" />
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowRemarksPopup(false)}
                className="text-sm text-gray-500 mr-4"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  statusUpdateHandler(workId, action, remarks);
                  setShowRemarksPopup(false);
                  setRemarks("")
                  
                }}
                className="text-sm text-blue-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default WorksTable;
