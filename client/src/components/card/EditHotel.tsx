interface Props {
  setHotelData: (users: any) => void;
  onClose: (value: boolean) => void;
  editingHotelDataProps?: any;
  hotelData?: any;
}

import { FaTimes } from "react-icons/fa";

import { toast } from "react-toastify";
import axios from "@/utils/axios";
import axios_ from "axios";
import React, { useState, useEffect, useRef } from "react";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

const EditHotel = ({
  setHotelData,
  onClose,
  editingHotelDataProps,
  hotelData,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [editingHotelData, setEditingHotelData] = useState<any>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [document, setDocument] = useState<any>(null);
  const [uploadingDocument, setUploadingDocument] = useState<boolean>(false);

  useEffect(() => {
    setEditingHotelData(editingHotelDataProps);
  }, [editingHotelDataProps]);

  const handleFileInput = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    try {
      const file = e.target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
          const dataURL = event.target?.result as string;
          setDocument(dataURL); // Set the Data URL to the state variable
        };

        // Read the file as Data URL
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error(error);
      // Handle any errors that might occur during file processing
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
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
    console.log(formValues)

    const numberRegex = /^[0-9]+$/;
    const nameRegex = /^[a-zA-Z ]+$/;

    if (!nameRegex.test(formValues.ownerName)) {
      toast.error("Owner name should contain only alphabets");
      return;
    }

    if (formValues.phoneNumber.length !== 10) {
      toast.error(
        "Phone number should contain only 10 numbers and don't include +91",
      );
      return;
    }

    if (formValues.aadharNumber.length !== 12) {
      toast.error("Aadhar number should contain only 12 numbers");
      return;
    }

    if (formValues.frontOfficeContact.length !== 10) {
      toast.error(
        "Front office contact should contain only 10 numbers and don't include +91",
      );
      return;
    }

    try {
      setLoading(true);
      setUploadingDocument(true);

      const newFile = {
        secure_url: "",
        public_id: "",
      };
      const API_KEY = "578159845172363";
      const CLOUD_NAME = "drtr0suuh";

      // console.log(API_KEY,CLOUD_NAME)

      if (document) {
        const { data: sign } = await axios.post("/signature/get-sign");
        // console.log(sign.signature,sign.timestamp)

        const { data: fileUrl } = await axios_.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
          {
            file: document,
            api_key: API_KEY,
            timestamp: sign.timestamp,
            signature: sign.signature,
          },
        );
        if (fileUrl) {
          newFile.secure_url = fileUrl.secure_url;
          newFile.public_id = fileUrl.public_id;
          setUploadingDocument(false);
        }
      }

      const { data } = await axios.post("/hotel/update-hotel", {
        id: editingHotelData._id,
        hotelName: formValues.hotelName,
        location: formValues.location,
        ownerName: formValues.ownerName,
        ownerContact: {
          phone: formValues.phoneNumber,
          email: formValues.email,
        },
        bank: formValues.bank,
        GSTNumber: formValues.GSTNumber,
        panNumber: formValues.panNumber,
        aadharNumber: formValues.aadharNumber,
        accountNumber: formValues.accountNumber,
        ifscCode: formValues.ifscCode,
        tradeLicense: formValues.tradeLicense,
        otherDocuments: newFile.secure_url
          ? newFile.secure_url
          : editingHotelData.otherDocuments,
        documentId: newFile.public_id
          ? newFile.public_id
          : formValues.documentId,
        frontOfficeContact: formValues.frontOfficeContact,
        roomCategories: formValues.roomCategories,
      });
      if (!data.error) {
        // const { data } = await axios.post("/user/get-users");
        const hotelIndex = hotelData.findIndex(
          (hotel: any) => hotel._id === editingHotelDataProps._id,
        );

        // If the user is found in the array, replace the data at that index
        if (hotelIndex !== -1) {
          setHotelData((prev: any) => {
            const updatedHotelData = [...prev];
            updatedHotelData[hotelIndex] = data.user;
            return updatedHotelData;
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
      <div className="flex mb-6">
        <p className="text-lg font-bold">Hotel Details</p>
        <span
          onClick={() => onClose(false)}
          className="ml-auto cursor-pointer text-xl"
        >
          &times;
        </span>
      </div>
      <div className="grid gap-2 grid-cols-3 md:grid-cols-3">
        <div>
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Hotel Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="hotelName"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Ex: Digha Saikatabas"
            required
            value={editingHotelData.hotelName}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  hotelName: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <select
            required
            onChange={
              (e) => {
                setEditingHotelData((prev: any) => {
                  return {
                    ...prev,
                    location: e.target.value.toLocaleUpperCase(),
                  };
                })
              }
            }
            id="plan"
            name="location"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option
              defaultValue={editingHotelData.location}
              value={editingHotelData.location}
            >
              {editingHotelData.location}
            </option>
            <option value="MANDARMANI">MANDARMANI</option>
            <option value="TAJPUR">TAJPUR</option>
            <option value="OLD DIGHA">OLD DIGHA</option>
            <option value="NEW DIGHA">NEW DIGHA</option>
            <option value="BAGDOGRA">BAGDOGRA</option>
            <option value="TARAPITH">TARAPITH</option>

          </select>
        </div>
        <div>
          <label
            htmlFor="company"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Owner Name <span className="text-red-500">*</span>
          </label>
          <input
            name="ownerName"
            type="text"
            id="company"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Subham"
            required
            value={editingHotelData.ownerName}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  ownerName: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            name="phoneNumber"
            // type="tel"
            id="phone"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="+91 999999999"
            required
            value={editingHotelData.ownerContact?.phone}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  ownerContact: { ...prev.ownerContact, phone: e.target.value },
                };
              });
            }}
          />
        </div>
        <div>
          <label
            htmlFor="website"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Bank <span className="text-red-500">*</span>
          </label>
          <input
            name="bank"
            type="text"
            id="bank"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="State Bank"
            required
            value={editingHotelData.bank}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return { ...prev, bank: e.target.value.toLocaleUpperCase() };
              });
            }}
          />
        </div>
        <div>
          <label
            htmlFor="visitors"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            GST Number <span className="text-red-500">*</span>
          </label>
          <input
          title="GST Number should be 15 characters long"
            name="GSTNumber"
            minLength={15}
            maxLength={15}
            type="text"
            id="visitors"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="GST Number"
            required
            value={editingHotelData.GSTNumber}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  GSTNumber: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
            // autoCapitalize="on"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="hotel@company.com"
            required
            value={editingHotelData.ownerContact?.email}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  ownerContact: { ...prev.ownerContact, email: e.target.value },
                };
              });
            }}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Pan Number <span className="text-red-500">*</span>
          </label>
          <input
            name="panNumber"
            type="text"
            id="pan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="AAAAA 1234A"
            required
            value={editingHotelData.panNumber}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  panNumber: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Aadhar Number <span className="text-red-500">*</span>
          </label>
          <input
            name="aadharNumber"
            type="number"
            id="adhar"
            className="appearence-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="2625-2331-7140"
            required
            value={editingHotelData.aadharNumber}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  aadharNumber: e.target.value,
                };
              });
            }}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="accountNumber"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Account Number
          </label>
          <input
            name="accountNumber"
            type="number"
            id="accountNumber"
            value={editingHotelData.accountNumber}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  accountNumber: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="0112345678"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="accountNumber"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            IFSC Code
          </label>
          <input
            name="ifscCode"
            type="text"
            id="ifscCode"
            value={editingHotelData.ifscCode}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  ifscCode: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="SBIN0005943"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Trade License <span className="text-red-500">*</span>
          </label>
          <input
            name="tradeLicense"
            type="text"
            id="Tread"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="2625-2331-7140"
            required
            value={editingHotelData.tradeLicense}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  tradeLicense: e.target.value,
                };
              });
            }}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Other Documents
          </label>
          <div className="flex gap-2 flex-col items-center justify-center">
            {!uploadingDocument && (
              <a
                className="defaultBtn mr-4"
                href={editingHotelData.otherDocuments}
              >
                View Old Document
              </a>
            )}
            <p className="text-xs">OR</p>
            <p className="text-xs">Upload New Document</p>
            <input
              type="file"
              id="Other Documents"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Add new"
              onChange={handleFileInput}
            />
            <input
              type="hidden"
              name="documentId"
              value={editingHotelData.documentId}
            />
            {uploadingDocument && <p>Uploading</p>}
          </div>
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Front Office Contact <span className="text-red-500">*</span>
          </label>
          <input
            name="frontOfficeContact"
            type="number"
            id="Other Documents"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Other Document"
            required
            value={editingHotelData.frontOfficeContact}
            onChange={(e) => {
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  frontOfficeContact: e.target.value,
                };
              });
            }}
          />
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Room categories
          </label>
          <textarea
            name="roomCategories"
            value={editingHotelData.roomCategories}
            onChange={(e) => {
              // e.target.value.replace(/[0-9]/g, '');
              setEditingHotelData((prev: any) => {
                return {
                  ...prev,
                  roomCategories: e.target.value.toLocaleUpperCase(),
                };
              });
            }}
            id="Other Documents"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="E.g. AC Deluxe, AC Standard"
            required
          />
        </div>
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

export default EditHotel;
