interface Props {
  setLeadData: (leads: any) => void;
  onClose: (value: boolean) => void;
  editingLeadDataProps?: any;
  leadData?: any;
  owner?: any;
}

import { FaTimes } from "react-icons/fa";

import { toast } from "react-toastify";
import axios from "@/utils/axios";
import React, { useState, useEffect, useRef } from "react";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

const EditLead = ({
  setLeadData,
  onClose,
  editingLeadDataProps,
  leadData,
  owner,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedData, setUpdatedData] = useState(false);
  const [editingLeadData, setEditingLeadData] =
    useState<any>(editingLeadDataProps);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (updatedData) {
      setUpdatedData(false);
      window.location.reload();
    }
  }, [updatedData]);

  // console.log(editingBookingData)
  useEffect(() => {
    // console.log(editingBookingDataProps)
    setEditingLeadData(editingLeadDataProps);
  }, [editingLeadDataProps]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: string } = {};

    // Collect all the form field values
    formData.forEach((value, key) => {
      formValues[key] = value as string;
      if (formValues[key].trim() === "") {
        // console.log(key)

        if (key !== "specialReq") {
          toast.error("Please fill all the fields");
        }

        return;
      }
    });
    const numberRegex = /^[0-9]+$/;
    const nameRegex = /^[a-zA-Z ]+$/;

    if(formValues.cn && formValues.cn.length !== 10){
        toast.error("Please enter a valid phone number and don't include +91");
        return;
    }

    if(formValues.guest_name && !nameRegex.test(formValues.guest_name)){
        toast.error("Guest name should contain only alphabets");
        return;
    }

    console.log(formValues);

   

    if (!nameRegex.test(formValues.guest_name)) {
      toast.error("Guest name should contain only alphabets");
      return;
    }

    if(!nameRegex.test(formValues.area)){
        toast.error("Area should contain only alphabets");
        return;
    }

    try {
      setLoading(true);



      const { data } = await axios.post("/leads/update-lead", {
        id: editingLeadData._id,
        guestName: formValues.guest_name,
        checkInDate: formValues.check_in_date,
        checkOutDate: formValues.check_out_date,
        numberOfPerson: formValues.nop,
        numberOfRooms: formValues.nor,
        contactNumber: formValues.cn,
        area: formValues.area,
        budget: formValues.budget,
        specialRequirements: formValues.specialReq,
      });
      if (!data.error) {
        // const { data } = await axios.post("/user/get-users");
        const leadIndex = leadData.findIndex(
          (lead: any) => lead._id === editingLeadData._id
        );

        // If the user is found in the array, replace the data at that index
        if (leadIndex !== -1) {
          setLeadData((prev: any) => {
            const updatedLeadData = [...prev];
            updatedLeadData[leadIndex] = data.lead;
            return updatedLeadData;
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
    <form onSubmit={handleUpdate} className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl w-full">
      <TailwindWrapper>
      <div className="flex w-full mb-6">
        <p className="font-bold text-lg">Edit Lead Details</p>
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
            Guest Name
          </label>
          <input
            type="text"
            name="guest_name"
            id="guest_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Ex: Digha Saikatabas"
            value={editingLeadData?.guestName}
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return {
                  ...prev,
                  guestName: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
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
            value={editingLeadData.checkInDate.split("T")[0]}
            min={
              owner.role !== "ADMIN"
                ? editingLeadData.checkInDate.split("T")[0]
                : ""
            }
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return { ...prev, checkInDate: e.target.value };
              });
            }}
            className="uppercase bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="08.08.2023"
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
            id="check_out_date"
            name="check_out_date"
            type="date"
            value={editingLeadData.checkOutDate.split("T")[0]}
            required
            min={editingLeadData.checkInDate.split("T")[0]}
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return { ...prev, checkOutDate: e.target.value };
              });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="09.09.2023"
          />
        </div>

        <div className="">
          <label
            htmlFor="nop"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Number of Persons <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nop"
            id="nop"
            value={editingLeadData?.numberOfPerson}
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return {
                  ...prev,
                  numberOfPerson: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Eg. 4"
          />
        </div>
        <div className="">
          <label
            htmlFor="nor"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Number of Rooms <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nor"
            id="nor"
            value={editingLeadData?.numberOfRooms}
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return { ...prev, numberOfRooms: e.target.value };
              });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Eg. 2"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contact number
          </label>
          <input
            type="number"
            id="cn"
            name="cn"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="+91 999999999"
            // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            value={editingLeadData?.contactNumber}
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return {
                  ...prev,
                  contactNumber: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
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
            value={editingLeadData?.area}
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return { ...prev, area: e.target.value };
              });
            }}
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
            value={editingLeadData?.budget}
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return { ...prev, budget: e.target.value };
              });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="">
          <label
            htmlFor="specialReq"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Special Requirements
          </label>
          <textarea
            cols={8}
            value={editingLeadData?.specialRequirements}
            onChange={(e) => {
              setEditingLeadData((prev: any) => {
                return {
                  ...prev,
                  specialRequirements: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
            id="specialReq"
            name="specialReq"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Well well well"
          />
        </div>

        {/* <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="Password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                required
              />
            </div> */}
      </div>
      <button
        type="submit"
        className="defaultBtn"
        disabled={loading}
      >
        Update
      </button>
      </TailwindWrapper>
    </form>
  );
};

export default EditLead;
