"use client";
import axios from "@/utils/axios";
import Select from "react-select";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

interface Props {
  setWorkData: (works: any) => void;
  onClose: (value: boolean) => void;
  editingWorkDataProps: any;
  workData: any;
}

const EditWork = ({
  setWorkData,
  onClose,
  editingWorkDataProps,
  workData,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [availableUsers, setAvailableUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [editingWorkData, setEditingWorkData] =
    useState<any>(editingWorkDataProps);
  const [reactSelectOptions, setReactSelectOptions] = useState<any>([]);
  // console.log("editingWorkData :)", editingWorkDataProps);
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/user/get-users");
        // console.log(data);
        if (!data.error) {
          setAvailableUsers(data.users);
          let options = data.users.map((user: any) => {
            return { value: user._id, label: user.name };
          });
          setReactSelectOptions(options);
          setEditingWorkData(editingWorkDataProps);
          setSelectedUser({
            value: editingWorkDataProps.userName._id,
            label: editingWorkDataProps.userName.name,
          });

        } else {
          // toast.error(data.error);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      }
    };
    getUsers();
  }, [editingWorkDataProps]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: string } = {};

    // Collect all the form field values
    formData.forEach((value, key) => {
      formValues[key] = value as string;
      if (formValues[key].trim() === "") {
        toast.error("Please fill all the fields");
        return;
      }
    });

    const nameRegex = /^[a-zA-Z ]+$/;

    try {
      setLoading(true);
      const { data } = await axios.post("/work/update-work", {
        workId: editingWorkData._id,
        workDetails: formValues.workDetails,
        finishDeadline: formValues.finishDeadline,
        userName: formValues.user,
      });
      if (!data.error) {
        // const { data } = await axios.post("/user/get-users");
        const workIndex = workData.findIndex(
          (work: any) => work._id === editingWorkData._id,
        );

        // If the user is found in the array, replace the data at that index
        if (workIndex !== -1) {
          setWorkData((prev: any) => {
            const updatedWorkData = [...prev];
            updatedWorkData[workIndex] = data.work;
            return updatedWorkData;
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
  const handleUsersSelection = (selectedOptions: any) => {
    setSelectedUser(selectedOptions);
  };

  return (
    <form
      ref={formRef}
      className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl w-full"
      onSubmit={handleSubmit}
    >
      <TailwindWrapper>
      <div className="flex w-full mb-6">
        <p className="font-bold text-lg">Work Details</p>
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
            className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Finish Deadline <span className="text-red-500">*</span>
          </label>
          <input
          value={editingWorkData.finishDeadline.split("T")[0]}
            type="date"
            name="finishDeadline"
            id="finishDeadline"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Ex: Digha Saikatabas"
            required
            onChange={(e) => {
              setEditingWorkData({
                ...editingWorkData,
                finishDeadline: e.target.value,
              });
            }
            }
          />
        </div>

        <div className="w-[340px]">
          <label
            htmlFor="hotel"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            User Name <span className="text-red-500">*</span>
          </label>
          <Select
            id="user"
            name="user"
            options={reactSelectOptions}
            value={selectedUser}
            onChange={handleUsersSelection}
            className="w-[90%] text-black"
          />
          {availableUsers.length === 0 && (
            <div className="text-xs text-red-600 font-medium">
              No users available*
            </div>
          )}
        </div>
        {/*<div className="">*/}
        {/*  <label*/}
        {/*    htmlFor="user"*/}
        {/*    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"*/}
        {/*  >*/}
        {/*    Modified Date*/}
        {/*  </label>*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    name="user"*/}
        {/*    id="user"*/}
        {/*    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"*/}
        {/*    value={new Date(workData.updatedAt).toLocaleDateString()}*/}
        {/*    readOnly*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
      <div className="mb-4">
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Work Details <span className="text-red-500">*</span>
        </label>
        <textarea
        value={editingWorkData.workDetails}
        onChange={(e) => {
          setEditingWorkData({
            ...editingWorkData,
            workDetails: e.target.value.toLocaleUpperCase(),
          });
        }
        }
          rows={4}
          name="workDetails"
          id="workDetails"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Ex: Digha Saikatabas"
          required
        />
      </div>

      <button
        type="submit"
        className="defaultBtn"
        disabled={
          loading || availableUsers.length === 0 || selectedUser.length === 0
        }
      >
        Update Work
      </button>
      </TailwindWrapper>
    </form>
  );
};

export default EditWork;
