interface Props {
  setHotelData: (users: any) => void;
  onClose: (value: boolean) => void;
}
import { FaTimes } from "react-icons/fa";

import { toast } from "react-toastify";
import axios from "@/utils/axios";
import axios_ from "axios";
import React, { useState, useEffect, useRef } from "react";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";
 
const InputHotel = ({ setHotelData, onClose }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [uploadingDocument, setUploadingDocument] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [gstNumber, setGstNumber] = useState<string>("");
  const [panNumber, setPanNumber] = useState<string>("");
  const [document, setDocument] = useState<any>();

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: string } = {};
    let roomCategories: string[] = []

    // Collect all the form field values
    formData.forEach((value, key) => {
      formValues[key] = value as string;

      if( key === "roomCategories"){
        roomCategories = value.toString().split(",")
        console.log(roomCategories)
      }

      if (formValues[key].trim() === "") {
        toast.error("Please fill all the fields");
        return;
      }
    });

    // console.log(formValues)
    const numberRegex = /^[0-9]+$/;
    const nameRegex = /^[a-zA-Z ]+$/;

    if (
      formValues.hotelName.trim() === "" ||
      formValues.location.trim() === "" ||
      formValues.ownerName.trim() === "" ||
      formValues.phoneNumber.trim() === "" ||
      formValues.bank.trim() === "" ||
      formValues.GSTNumber.trim() === "" ||
      formValues.panNumber.trim() === "" ||
      formValues.aadharNumber.trim() === "" ||
      formValues.tradeLicense.trim() === "" ||
      formValues.frontOfficeContact.trim() === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!nameRegex.test(formValues.ownerName)) {
      toast.error("Owner name should contain only alphabets");
      return;
    }

    if (
      !numberRegex.test(formValues.phoneNumber) ||
      formValues.phoneNumber.length !== 10
    ) {
      toast.error(
        "Phone number should contain only 10 numbers and don't include +91",
      );
      return;
    }

    if (formValues.aadharNumber.length !== 12) {
      // console.log(!numberRegex.test(formValues.aadharNumber))
      toast.error("Aadhar number should contain only 12 numbers");
      return;
    }

    if (
      !numberRegex.test(formValues.frontOfficeContact) ||
      formValues.frontOfficeContact.length !== 10
    ) {
      toast.error(
        "Front office contact should contain only 10 numbers and don't include +91",
      );
      return;
    }

    try {
      // console.log(document)
      setLoading(true);
      setUploadingDocument(true);
      const API_KEY = "578159845172363";
      const CLOUD_NAME = "drtr0suuh";

      // console.log(API_KEY,CLOUD_NAME)

      const { data: sign } = await axios.post("/signature/get-sign");
      // console.log(sign.signature,sign.timestamp)
      // console.log(document)

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
        const { data } = await axios.post("/hotel/create-hotel", {
          hotelName: formValues.hotelName,
          location: formValues.location,
          ownerName: formValues.ownerName,
          ownerContact: {
            phone: formValues.phoneNumber,
            email: formValues.email ?? "",
          },
          bank: formValues.bank,
          GSTNumber: formValues.GSTNumber,
          panNumber: formValues.panNumber,
          aadharNumber: formValues.aadharNumber,
          tradeLicense: formValues.tradeLicense,
          accountNumber: formValues.accountNumber,
          ifscCode: formValues.ifscCode,
          otherDocuments: fileUrl.secure_url,
          documentId: fileUrl.public_id,
          frontOfficeContact: formValues.frontOfficeContact,
          roomCategories: roomCategories
        });
        if (!data.error) {
          // const { data } = await axios.get("/hotel/get-all-hotels")
  
          // console.log(data.hotel)
          setHotelData((prev: any) => {
            return [data.hotel, ...prev];
          });
          setUploadingDocument(false);
          onClose(false);
  
          toast.success(data.message);
          formRef.current?.reset();
        } else {
          toast.error(data.error);
        }
        setLoading(false);

      } 
      else{
        setLoading(false);
        toast.error("Upload failed");
      }
        
      

      
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
    
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl "
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
      <div className="grid gap-4 grid-cols-3  md:grid-cols-3">
        <div>
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Hotel Name
          </label>
          <input
            type="text"
            name="hotelName"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
            required
            onChange={(e) =>
              (e.target.value = e.target.value.toLocaleUpperCase())
            }
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Location
          </label>
          <select
          required
            id="location"
            name="location"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected disabled>--Choose--</option>

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
            Owner Name
          </label>
          <input
            name="ownerName"
            type="text"
            id="company"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Subham"
            required
            onChange={(e) =>
              (e.target.value = e.target.value.toLocaleUpperCase())
            }
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone number
          </label>
          <input
            name="phoneNumber"
            type="tel"
            id="phone"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="+91 999999999"
            required
          />
        </div>
        <div>
          <label
            htmlFor="website"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Bank
          </label>
          <input
            name="bank"
            type="text"
            id="bank"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="State Bank"
            required
            onChange={(e) =>
              (e.target.value = e.target.value.toLocaleUpperCase())
            }
          />
        </div>
        <div>
          <label
            htmlFor="visitors"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            GST Number
          </label>
          <input
          title="GST Number should be 15 characters long"
            name="GSTNumber"
            type="text"
            id="visitors"
            value={gstNumber}
            onChange={(e) => {
              setGstNumber(e.target.value.toLocaleUpperCase());
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="GST Number"
            required
            minLength={15}
            // autoCapitalize="on"
          />
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <input
            name="email"
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="hotel@company.com "
          />
        </div>

        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Pan Number
          </label>
          <input
            name="panNumber"
            autoCapitalize="on"
            type="text"
            id="pan"
            value={panNumber}
            onChange={(e) => {
              setPanNumber(e.target.value.toLocaleUpperCase());
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="AAAAA 1234A"
            required
          />
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Aadhar Number
          </label>
          <input
            name="aadharNumber"
            type="number"
            id="adhar"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="2625-2331-7140"
            required
          />
        </div>
        <div className="">
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="0112345678"
            required
          />
        </div>
        <div className="">
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="SBIN0005943"
            onChange={(e) =>
              (e.target.value = e.target.value.toLocaleUpperCase())
            }
            required
          />
        </div>

        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Trade License
          </label>
          <input
            name="tradeLicense"
            type="text"
            id="Tread"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="2625-2331-7140"
            required
          />
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Other Documents
          </label>
          <input
            type="file"
            id="Other Documents"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Other Document"
            accept="application/pdf"
            required
            onChange={handleFileInput}
          />
          {uploadingDocument && <p>Uploading...</p>}
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Front Office Contact
          </label>
          <input
            name="frontOfficeContact"
            type="number"
            id="Other Documents"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Contact Number"
            required
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
            onChange={(e)=>{
              e.target.value = e.target.value.toLocaleUpperCase();
              e.target.value = e.target.value.replace(/[0-9]/g, '');
            }}
            id="Other Documents"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="E.g. AC Deluxe, AC Standard"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
      <button
        disabled={uploadingDocument}
        type="submit"
        className="defaultBtn"
      >
        {uploadingDocument? 'Please Wait...' : 'Submit'}
      </button>
      <button
        disabled={uploadingDocument}
        type="reset"
        className="defaultBtn"
      >
        Reset
      </button>
      </div>
      </TailwindWrapper>
    </form>
  );
};

export default InputHotel;
