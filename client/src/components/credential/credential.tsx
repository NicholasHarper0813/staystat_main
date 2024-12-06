import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Alert } from "@/components/ui/alert";
import { toast } from "react-toastify";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { useSnackbar } from "notistack";

const Credential = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Credentials copied to clipboard!");
  };
  useEffect(() => {
    if (isAlertVisible) {
      const snackbarId = enqueueSnackbar(
        <div className="flex items-center">
          <IoMdInformationCircleOutline className="flex-shrink-0 w-5 h-5 mr-3" />
          <span>
            We use free server and database.
            <br /> It may be slow, so please be patient and donot close the
            page.
          </span>
        </div>,
        {
          variant: "warning",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          persist: true,
          action: (key) => (
            <button
              onClick={() => {
                closeSnackbar(key);
                setIsAlertVisible(false);
              }}
              className="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8"
            >
              <IoCloseOutline className="w-4 h-4" />
            </button>
          ),
        },
      );

      return () => {
        closeSnackbar(snackbarId);
      };
    }
  }, [enqueueSnackbar, closeSnackbar, isAlertVisible]);
  return (
    <div className="w-full mx-auto flex flex-row h-fit overflow-hidden">
      <Alert className="text-black bg-stone-100 border-stone-300/25 mb-4 w-full">
        <div className="my-10"></div>
        <div className="w-full  bg-white border border-gray-200 shadow rounded-lg p-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            🔥 Test Credentials
          </h2>
          <div className="bg-gray-50 p-1 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-bold">ADMIN</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-tiny ">Username:</span>
                  <code className="bg-gray-200 px-1 py-0.5 rounded font-sm  w-full flex justify-between mb-3">
                    <span className="text-blue-500">subham@admin.com</span>
                    <button
                      onClick={() => copyToClipboard("subham@admin.com")}
                      className="text-gray-500 hover:bg-gray-100 rounded-lg p-1 inline-flex items-center justify-center"
                      title="Copy username"
                    >
                      <FaCopy className="w-3.5 h-3.5" />
                    </button>
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-tiny ">Password:</span>
                  <code className="bg-gray-200 px-1 py-0.5 rounded font-sm w-full flex justify-between">
                    <span className="text-blue-500">Admin@123#Subham</span>
                    <button
                      onClick={() => copyToClipboard("Admin@123#Subham")}
                      className="ml-1 text-gray-500 hover:bg-gray-100 rounded-lg p-1 inline-flex items-center justify-center"
                      title="Copy password"
                    >
                      <FaCopy className="w-3.5 h-3.5" />
                    </button>
                  </code>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-bold">
                  SUB-ADMIN
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-tiny ">Username:</span>
                  <code className="bg-gray-200 px-1 py-0.5 rounded font-sm w-full flex justify-between mb-3">
                    <span className="text-blue-500">subham@subadmin.com</span>
                    <button
                      onClick={() => copyToClipboard("subham@subadmin.com")}
                      className="text-gray-500 hover:bg-gray-100 rounded-lg p-1 inline-flex items-center justify-center"
                      title="Copy username"
                    >
                      <FaCopy className="w-3.5 h-3.5" />
                    </button>
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-tiny ">Password:</span>
                  <code className="bg-gray-200 px-1 py-0.5 rounded font-sm w-full flex justify-between">
                    <span className="text-blue-500">SubAdmin@123#Subham</span>
                    <button
                      onClick={() => copyToClipboard("SubAdmin@123#Subham")}
                      className="ml-1 text-gray-500 hover:bg-gray-100 rounded-lg p-1 inline-flex items-center justify-center"
                      title="Copy password"
                    >
                      <FaCopy className="w-3.5 h-3.5" />
                    </button>
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button className="defaultBtn mb-5" onPress={onOpen}>
            All Features
          </Button>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            className="bg-stone-200 text-black"
            backdrop="blur"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Features
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Magna exercitation reprehenderit magna aute tempor
                      cupidatat consequat elit dolor adipisicing. Mollit dolor
                      eiusmod sunt ex incididunt cillum quis. Velit duis sit
                      officia eiusmod Lorem aliqua enim laboris do dolor
                      eiusmod. Et mollit incididunt nisi consectetur esse
                      laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                      deserunt nostrud ad veniam.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                      Magna exercitation reprehenderit magna aute tempor
                      cupidatat consequat elit dolor adipisicing. Mollit dolor
                      eiusmod sunt ex incididunt cillum quis. Velit duis sit
                      officia eiusmod Lorem aliqua enim laboris do dolor
                      eiusmod. Et mollit incididunt nisi consectetur esse
                      laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                      deserunt nostrud ad veniam.
                    </p>
                    <p>
                      Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
                      duis sit officia eiusmod Lorem aliqua enim laboris do
                      dolor eiusmod. Et mollit incididunt nisi consectetur esse
                      laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                      deserunt nostrud ad veniam. Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Nullam pulvinar risus non
                      risus hendrerit venenatis. Pellentesque sit amet hendrerit
                      risus, sed porttitor quam. Magna exercitation
                      reprehenderit magna aute tempor cupidatat consequat elit
                      dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt
                      cillum quis. Velit duis sit officia eiusmod Lorem aliqua
                      enim laboris do dolor eiusmod. Et mollit incididunt nisi
                      consectetur esse laborum eiusmod pariatur proident Lorem
                      eiusmod et. Culpa deserunt nostrud ad veniam.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Magna exercitation reprehenderit magna aute tempor
                      cupidatat consequat elit dolor adipisicing. Mollit dolor
                      eiusmod sunt ex incididunt cillum quis. Velit duis sit
                      officia eiusmod Lorem aliqua enim laboris do dolor
                      eiusmod. Et mollit incididunt nisi consectetur esse
                      laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                      deserunt nostrud ad veniam.
                    </p>
                    <p>
                      Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
                      duis sit officia eiusmod Lorem aliqua enim laboris do
                      dolor eiusmod. Et mollit incididunt nisi consectetur esse
                      laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                      deserunt nostrud ad veniam. Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Nullam pulvinar risus non
                      risus hendrerit venenatis. Pellentesque sit amet hendrerit
                      risus, sed porttitor quam. Magna exercitation
                      reprehenderit magna aute tempor cupidatat consequat elit
                      dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt
                      cillum quis. Velit duis sit officia eiusmod Lorem aliqua
                      enim laboris do dolor eiusmod. Et mollit incididunt nisi
                      consectetur esse laborum eiusmod pariatur proident Lorem
                      eiusmod et. Culpa deserunt nostrud ad veniam.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </Alert>
    </div>
  );
};

export default Credential;
