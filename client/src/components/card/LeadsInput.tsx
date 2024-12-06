"use client";
import axios from "@/utils/axios";
import Select from "react-select";
import React, { useState, useEffect, useRef } from "react";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

interface Props {
  setLeadsData: (lead: any) => void;
  onClose: (value: boolean) => void;
}

const LeadsInput = ({ setLeadsData, onClose }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkInDate, setCheckInDate] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: string } = {};

    // Collect all the form field values
    formData.forEach((value, key) => {
      formValues[key] = value as string;
      if (formValues[key].trim() === "") {
        if(key !== "specialReq"){
          toast.error("Please fill all the fields");
        }
        return;
      }
    });

    const numberRegex = /^[0-9]+$/;
    const nameRegex = /^[a-zA-Z ]+$/;

    if (formValues.cn.length !== 10) {
      toast.error("Please enter a valid phone number and don't include +91");
      return;
    }

    if (
      formValues.guest_name.trim() == "" ||
      !nameRegex.test(formValues.guest_name)
    ) {
      toast.error("Please enter a valid name");
      return;
    }


    try {
      setLoading(true);
      const { data } = await axios.post("/leads/create-lead", {
        guestName: formValues.guest_name,
        checkInDate: formValues.check_in_date,
        checkOutDate: formValues.check_out_date,
        numberOfPerson: formValues.nop,
        numberOfRooms: formValues.nor,
        contactNumber: formValues.cn,
        area: formValues.area,
        budget: formValues.budget,
        specialRequirements: formValues.specialReq,
        status: "PENDING",
      });
      if (!data.error) {
        // const { data } = await axios.post("/user/get-users");
        setLeadsData((prev: any) => {
          return [data.lead, ...prev];
        });
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
      ref={formRef}
      className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl w-full"
      onSubmit={handleSubmit}
    >
      <TailwindWrapper>
      <div className="flex w-full mb-6">
        <p className="font-bold text-lg">Lead Details</p>
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
            htmlFor="guest_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Guest Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="guest_name"
            id="guest_name"
            onChange={(e) =>
              (e.target.value = e.target.value.toLocaleUpperCase())
            }
            className="uppercase bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
            required
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
            id="check_in_date"
            name="check_in_date"
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="uppercase bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label
            htmlFor="check_out_date"
            className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Check-out Date <span className="text-red-500">*</span>
          </label>
          <input
          disabled={!checkInDate}
            id="check_out_date"
            name="check_out_date"
            type="date"
            className="uppercase bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
            required
            min={checkInDate}
          />
        </div>

        <div className="">
          <label
            htmlFor="nop"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            No. of Persons <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nop"
            id="nop"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
            required
          />
        </div>
        <div className="">
          <label
            htmlFor="nor"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            No. of Rooms <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nor"
            id="nor"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
            required
          />
        </div>
        <div className="">
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
          />
        </div>
        <div>
          <label
            htmlFor="area"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Area <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="area"
            id="area"
            
            onChange={(e) =>
              (e.target.value = e.target.value.toLocaleUpperCase())
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="budget"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Budget <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="budget"
            id="budget"
           
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="">
          <label
            htmlFor="specialReq"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap"
          >
            Special Requirements
          </label>
          <textarea
            cols={8}
            onChange={(e) =>
              (e.target.value = e.target.value.toLocaleUpperCase())
            }
            id="specialReq"
            name="specialReq"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
          />
        </div>
      </div>

      <button
        type="submit"
        className="defaultBtn"
        disabled={loading}
      >
        Submit
      </button>
      </TailwindWrapper>
    </form>
  );
};

export default LeadsInput;
