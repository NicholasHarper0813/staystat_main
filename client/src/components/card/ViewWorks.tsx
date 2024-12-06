import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdFileDownloadDone } from "react-icons/md";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

interface Props {
  workData: {
    _id: string;
    userName?: { name: string; _id: string; userName: string };
    workDetails?: string;
    finishDeadline: string;
    updatedAt: string;
    workConfirm?: string;
    remarks?: string;
    createdBy: { _id: string };
  };
  onClose: (value: boolean) => void;
  deleteWorkHandler: (workId: string) => void;
  setShowEditWorkModal: (value: boolean) => void;
  setEditingWorkData: (work: any) => void;
  statusUpdateHandler: (
    workId: string,
    action: string,
    remarks: string
  ) => void;
  owner?: any;
}

const ViewWorks = ({
  workData,
  onClose,
  deleteWorkHandler,
  statusUpdateHandler,
  setShowEditWorkModal,
  setEditingWorkData,
  owner,
}: Props) => {
  const [showDeletePopup, setShowDeletePopUp] = useState<boolean>(false);
  const [showRemarksPopup, setShowRemarksPopup] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  // console.log("workData :)", workData);
  // @ts-ignore

  const handleShowDeleteModal = (event: any) => {
    event.preventDefault();
    setShowDeletePopUp(true);
  };

  const showAcceptModal = (event: any, action: string) => {
    event.preventDefault();
    setShowRemarksPopup(true);
    setAction(action);
  };

  const showRejectModal = (event: any, action: string) => {
    event.preventDefault();
    setShowRemarksPopup(true);
    setAction(action);
  };
  return (
    <>
      <form className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl w-full">
        <TailwindWrapper>
        <div className="flex w-full mb-6">
          <p className="font-bold text-lg">Work Generate</p>
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
              htmlFor="finishDeadline"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Finish Deadline
            </label>
            <input
              type="text"
              name="finishDeadline"
              id="finishDeadline"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              // value={workData?.finishDeadline}
              value={new Date(workData.finishDeadline).toLocaleDateString()}
              readOnly
            />
          </div>

          <div className="">
            <label
              htmlFor="user"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              User Name
            </label>
            <input
              type="text"
              name="user"
              id="user"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
              value={workData?.userName?.name}
              readOnly
            />
          </div>

          <div className="">
            <label
              htmlFor="user"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Modified Date
            </label>
            <input
              type="text"
              name="user"
              id="user"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
              value={new Date(workData.updatedAt).toLocaleDateString()}
              readOnly
            />
          </div>
          <div className="">
            <label
              htmlFor="user"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status
            </label>
            <input
              type="text"
              name="user"
              id="user"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
              value={workData?.workConfirm}
              readOnly
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="workDetails"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Remarks
          </label>
          <textarea
            rows={4}
            name="workDetails"
            id="workDetails"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={workData?.remarks || "no remarks"}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="workDetails"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Work Details
          </label>
          <textarea
            rows={4}
            name="workDetails"
            id="workDetails"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={workData?.workDetails}
            readOnly
          />
          {owner.role !== "SUBADMIN" && (
            <div className="flex mt-2 justify-center items-center">
              <button
                disabled={
                  workData.createdBy._id !== owner._id && owner.role !== "ADMIN"
                }
                // data-tip={"Preview Link"}
                onClick={(e) => {
                  e.preventDefault()
                  setShowEditWorkModal(true);
                  setEditingWorkData(workData);
                  onClose(false);
                }}
                className={`flex justify-center items-center gap-2 w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
              >
                <FiEdit className="" />
                <p>Edit</p>
              </button>
              <button
                disabled={
                  workData.createdBy._id !== owner._id && owner.role !== "ADMIN"
                }
                data-tip={"Delete Hotel"}
                onClick={(event) => {
                  handleShowDeleteModal(event);
                }}
                className={`flex justify-center items-center gap-2 w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
              >
                <RiDeleteBin6Line size={15} className="" />
                <p>Delete</p>
              </button>
            </div>
          )}
          
        </div>
        </TailwindWrapper>
      </form>
      {showDeletePopup && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-black">Delete Work</h1>
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
                  deleteWorkHandler(workData._id);
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
      {showRemarksPopup && (
        <div className=" z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-black">Accept / Reject</h1>
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
            <textarea
              placeholder="Enter remarks"
              required
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-xl mt-2"
            />
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowRemarksPopup(false)}
                className="text-sm text-gray-500 mr-4"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  statusUpdateHandler(workData._id, action, remarks);
                  setShowRemarksPopup(false);
                  setRemarks("");
                }}
                className="text-sm text-blue-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewWorks;
