"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaPlus, FaTimes } from "react-icons/fa";
import * as xlsx from "xlsx";
import { utils, writeFile } from "xlsx";
import BookingTable from "@/components/Table/BookingTable";
import axios from "@/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import InputBooking from "@/components/card/inputBooking";
import ViewBooking from "@/components/card/ViewBookings";
import { fetchOwner } from "@/utils";
import { FcNext, FcPrevious } from "react-icons/fc";
import { CiSquareRemove } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import Filter from "@/components/card/Filter";
import { SiMicrosoftexcel } from "react-icons/si";
import { FRONTEND_URL } from "@/constants/constant";
import EditBooking from "@/components/card/EditBooking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, Card, CardBody } from "@nextui-org/react";
import XlsxTable from "@/components/ui/custom/xlsx-table/xlsx-table";
import XlsxDangerModal from "@/components/ui/custom/xlsx-table/modal/xlsx-danger-modal";
import {
  Calendar as CalendarIcon,
  FolderDown,
  Home,
  ListRestart,
  RotateCcw,
  Save,
} from "lucide-react";
import Context from "@/context/Context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select as NextUISelect,
  SelectItem as NextUISelectItem,
} from "@nextui-org/select";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendars } from "@/components/ui/calendar";

const Bookings = () => {
  const PAGE_LIMIT = 50;
  const [page, setPage] = useState(1);
  const [stayColor, setStayColor] = useState<boolean>(false);
  const [searchText, setSearchText] = useState(""); // {users: [], usersCount: 0}
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<any>();
  const [filteredData, setFilteredData] = useState<any>(); // {users: [], usersCount: 0}
  const [bookingData, setBookingData] = useState<any>([]);
  const [bookingDataStats, setBookingDataStats] = useState<any>({
    totalBookingAmt: 0,
    totalAdvanceAmt: 0,
    totalDueAmt: 0,
  });
  const [xlsxFile, setXlsxFile] = useState<any>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingCounts, setBookingCounts] = useState<number>(0);
  const [booking, setBooking] = useState<any>();
  const [showViewModal, setShowViewModal] = useState<boolean>();
  const [user, setUser] = useState<any>({});
  const [accountType, setAccountType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingBookingData, setEditingBookingData] = useState<object>({});
  const [onFilterOpen, setOnFilterOpen] = useState<boolean>(false);
  const [showDownloadPopUp, setShowDownloadPopUp] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (showModal || showViewModal || showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showViewModal, showModal, showEditModal]);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
    let updateUser = async () => {
      const user = await fetchOwner(userId);

      if (user && user._id && user.isActive) {
        setUser(user);
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

  const getBookingsBySearch = async (e?: any) => {
    setFilterData(null);
    e && e.preventDefault();
    try {
      if (searchText?.trim()?.length > 0) {
        let { data } = await axios.withCache({
          method: "get",
          url: `/booking/get-all-bookings/search`,
          params: { query: searchText },
          cacheTime: 5 * 60 * 1000,
        });

        if (!data.error) {
          setBookingData(data.bookings);
          data.message && toast.info(data.message);
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.log("Error getting forms", error);
    }
  };

  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);

        const { data } = await axios.post(
          `/booking/get-all-bookings?page=${page}&limit=${PAGE_LIMIT}&filterBy=${filterData?.filterBy}&hotelName=${filterData?.hotelName}&bookingSource=${filterData?.bookingSource}&guestName=${filterData?.guestName}&serialNumber=${filterData?.serialNumber}&status=${filterData?.status}&addedBy=${filterData?.addedBy}`,
          {
            startDate: filterData?.dateRange?.startDate ?? null,
            endDate: filterData?.dateRange?.endDate ?? null,
          },
        );
        if (!data.error) {
          setBookingData(data.bookings);
          setBookingCounts(data.bookingsCount);
          setFilteredData(data.bookingsForCalculation);
          setBookingDataStats((prev: any) => {
            return {
              ...prev,
              totalBookingAmt: data.totalBookingAmt,
              totalAdvanceAmt: data.totalAdvanceAmt,
              totalDueAmt: data.totalDueAmt,
            };
          });
          data.message && console.log(data.message);
        } else {
          console.log(data.error);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.log(error);
        console.log(error);
      }
    };
    searchText.trim().length > 0 ? getBookingsBySearch() : getBookings();
  }, [page, PAGE_LIMIT, reloadData, filterData]);

  const cancelBookingHandler = async (bookingId: string) => {
    setFilterData(null);
    try {
      const { data } = await axios.post(`/booking/cancel-booking`, {
        bookingId,
        status: "CANCELLED",
      });
      if (!data.error) {
        toast.success(data.message);
        const { data: bookingData } = await axios.post(
          `/booking/get-all-bookings?page=${page}&limit=${PAGE_LIMIT}&filterBy=${filterData?.filterBy}&hotelName=${filterData?.hotelName}&bookingSource=${filterData?.bookingSource}&guestName=${filterData?.guestName}&serialNumber=${filterData?.serialNumber}&status=${filterData?.status}&addedBy=${filterData?.addedBy}`,
          {
            startDate: filterData?.dateRange?.startDate ?? null,
            endDate: filterData?.dateRange?.endDate ?? null,
          },
        );
        if (!bookingData.error) {
          setBookingData(bookingData.bookings);
          setBookingCounts(bookingData.bookingsCount);
        } else {
          toast.error(bookingData.error);
        }
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const undoCancelBookingHandler = async (bookingId: string) => {
    setFilterData(null);
    try {
      const { data } = await axios.post(`/booking/undo-cancel-booking`, {
        bookingId,
        status: "CONFIRMED",
      });
      if (!data.error) {
        toast.success(data.message);
        const { data: bookingData } = await axios.post(
          `/booking/get-all-bookings?page=${page}&limit=${PAGE_LIMIT}&filterBy=${filterData?.filterBy}&hotelName=${filterData?.hotelName}&bookingSource=${filterData?.bookingSource}&guestName=${filterData?.guestName}&serialNumber=${filterData?.serialNumber}&status=${filterData?.status}&addedBy=${filterData?.addedBy}`,
          {
            startDate: filterData?.dateRange?.startDate ?? null,
            endDate: filterData?.dateRange?.endDate ?? null,
          },
        );
        if (!bookingData.error) {
          setBookingData(bookingData.bookings);
          setBookingCounts(bookingData.bookingsCount);
        } else {
          toast.error(bookingData.error);
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
    const getBookingsFordownload = async () => {
      try {
        const { data } = await axios.post(
          `/booking/get-all-bookings?filterBy=${filterData?.filterBy}&hotelName=${filterData?.hotelName}&bookingSource=${filterData?.bookingSource}&guestName=${filterData?.guestName}&serialNumber=${filterData?.serialNumber}&status=${filterData?.status}&addedBy=${filterData?.addedBy}`,
          {
            startDate: filterData?.dateRange?.startDate ?? null,
            endDate: filterData?.dateRange?.endDate ?? null,
          },
        );
        if (!data.error) {
          return data.bookings;
        } else {
          toast.error(data.error);
        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      }
    };

    let bookingDataFormDownload;

    if (searchText.trim().length > 0) {
      bookingDataFormDownload = bookingData;
    } else if (filterData) {
      bookingDataFormDownload = filteredData;
    } else {
      bookingDataFormDownload = await getBookingsFordownload();
    }

    let bookingDataForExcel = bookingDataFormDownload.map((booking: any) => {
      return {
        "Reservation Number": booking.serialNumber,
        "Hotel Name": booking.hotel?.hotelName,
        "Guest Name": booking.guestName,
        "Guest Contact": booking.contactNumber,
        "Guest Email": booking.guestEmail ? booking.guestEmail : "No Data",
        "Check-In Date": `${new Date(booking.checkInDate).getDate()}-${new Date(booking.checkInDate).getMonth() + 1}-${new Date(booking.checkInDate).getFullYear()}`,
        "Check-Out Date": `${new Date(booking.checkOutDate).getDate()}-${new Date(booking.checkOutDate).getMonth() + 1}-${new Date(booking.checkOutDate).getFullYear()}`,
        "Number of Rooms": booking.numberOfRooms,
        "Number of Person": booking.numberOfPersons,
        "Room Category": booking.roomCategory,
        "Booking Amount": booking.bookingAmount,
        "Advance Amount": booking.advanceAmount,
        "Due Amount": booking.dueAmount,
        "Advance Date": `${new Date(booking.advanceDate).getDate()}-${new Date(booking.advanceDate).getMonth() + 1}-${new Date(booking.advanceDate).getFullYear()}`,
        "Account Type": booking.accountType,
        "Booking Source": booking.bookingSource,
        "Booked By": booking.bookingBy,
        "Booking Status": booking.status,
        "Modified Date": `${new Date(booking.updatedAt).getDate()}-${new Date(booking.updatedAt).getMonth() + 1}-${new Date(booking.updatedAt).getFullYear()}`,
        Plan: booking.plan,
        Remarks: booking.remarks,
      };
    });

    const worksheet = utils.json_to_sheet(bookingDataForExcel);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(
      workbook,
      `Bookings-${user.name || user.username}-${new Date().toDateString()}.xlsx`,
    );
  };

  //upload excel file
  //Basic validation : TODO: no requirement so no need to do it
  const requiredFields = [
    "Hotel Name",
    "Guest Name",
    "Guest Contact",
    "Guest Email",
    "Check-In Date",
    "Check-Out Date",
    "Number of Rooms",
    "Number of Person",
    "Room Category",
    "Booking Amount",
    "Advance Amount",
    "Advance Date",
    "Account Type",
    "Booking Source",
    "Booked By",
    "Booking Status",
    "Plan",
    "Remarks",
  ];
  function formatDate(date: {
    getTimezoneOffset: () => number;
    getTime: () => number;
  }) {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() - timezoneOffset);
    const day = adjustedDate.getDate();
    const month = adjustedDate.getMonth() + 1;
    const year = adjustedDate.getFullYear();
    return `${day}-${month}-${year}`;
  }
  xlsx.SSF.load_table({
    0: "General",
    14: "m-d-yy",
  });
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      const fileType = file.name.split(".").pop();

      if (fileType !== "xlsx") {
        toast(() => (
          <>
            <strong>Invalid file type</strong>
            <p>Please upload an Excel (.xlsx) file.</p>
          </>
        ));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let json = xlsx.utils.sheet_to_json(worksheet, { dateNF: "m-d-yy" });

        if (json.length > 130) {
          toast(() => (
            <>
              <strong>Data limit exceeded</strong>
              <p>You cannot upload more than 130 records.</p>
            </>
          ));
          return;
        }

        json = json.map((row: any) => {
          for (let key in row) {
            if (row[key] instanceof Date) {
              row[key] = formatDate(row[key]);
            } else if (typeof row[key] === "string") {
              row[key] = row[key].toUpperCase();
            }
          }
          return row;
        });

        const keys = Object.keys(json[0] as object);
        const isFieldMismatch =
          keys.length !== requiredFields.length ||
          !requiredFields.every((field) => keys.includes(field));
        const isModifiedFieldPresent = keys.includes("Modified Date");

        if (isFieldMismatch || isModifiedFieldPresent) {
          toast(() => (
            <>
              <strong>Column mismatch</strong>
              <p>The uploaded file does not match the required format.</p>
            </>
          ));
          return;
        }

        setXlsxFile(json);

        toast(() => (
          <>
            <strong>File uploaded</strong>
            <p>Thank you, the Excel file has been uploaded successfully.</p>
          </>
        ));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const handleSaveExcel = () => {
    if (!xlsxFile || xlsxFile.length === 0) {
      toast(() => (
        <>
          <strong>No file uploaded</strong>
          <p>Please upload an Excel (.xlsx) file.</p>
        </>
      ));
      return;
    }
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (isConfirmed) {
      const toastId = toast("Loading...", { autoClose: false });

      axios
        .post("/bookings/updatexlsx", xlsxFile)
        .then((response: any) => {
          console.log(response);
          setIsConfirmed(false);

          // Reset the xlsxFile state here
          setXlsxFile([]);

          // Update the toast to show success
          toast.update(toastId, {
            render: "Upload successful!",
            type: toast.TYPE.SUCCESS,
            autoClose: 5000,
          });
        })
        .catch((error: any) => {
          console.error("Error object:", error);
          console.error("Error details:", error.response);

          // Update the toast to show the error
          toast.update(toastId, {
            render: `Error: ${error.message}`,
            type: toast.TYPE.ERROR,
            autoClose: 5000,
          });
        });
    }
  }, [isConfirmed, xlsxFile]);

  const handleOnDownload = () => {
    const excelFilePath = "/samplecsv.xlsx";
    const link = document.createElement("a");
    link.href = excelFilePath;
    link.download = "samplecsv.xlsx";
    link.click();
  };

  const getStayBookings = async (selectedDate: any, hotelName: string) => {
    setFilterData((prev: any) => ({
      ...prev,
      filterBy: "stay",
      hotelName: hotelName,
    }));

    try {
      const { data } = await axios.post(
        `/booking/get-all-bookings?page=${page}&limit=${PAGE_LIMIT}&filterBy=stay&hotelName=${hotelName}&bookingSource=${filterData?.bookingSource}&guestName=${filterData?.guestName}&serialNumber=${filterData?.serialNumber}&status=${filterData?.status}&addedBy=${filterData?.addedBy}`,
        {
          startDate: selectedDate,
          endDate: null,
        },
      );
      if (!data.error) {
        setBookingData(data.bookings);
        setBookingCounts(data.bookingsCount);
        setStayColor(true);
      } else {
        console.log(data.error);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  console.log("bookingData", bookingData);

  // console.log(JSON.stringify(xlsxFile) + "xlsxFile");

  const resetState = () => {
    setXlsxFile([]);
    setIsConfirmed(false);
    toast(() => (
      <>
        <strong>Data Reset Successful</strong>
        <p>
          Please close the side panel and re-upload your file for a fresh start.
        </p>
      </>
    ));
  };
  const { date, setDate } = useContext(Context);
  const [users, setUsers] = React.useState<any>([]);
  const [hotels, setHotels] = React.useState<any>([]);
  const [stayHotels, setStayHotels] = useState({
    hotelName: "--select--",
  });
  const addIndianTime = (selectedDate: Date) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(updatedDate.getHours() + 6);
    updatedDate.setMinutes(updatedDate.getMinutes() + 30);
    return updatedDate;
  };
  useEffect(() => {
    const getHotels = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(`/hotel/get-all-hotels`);
        const { data: users } = await axios.get(`/user/get-all-users`);

        if (!data.error) {
          setHotels(data.hotels);
          setUsers(users.users);
        } else {
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.log(error);
      }
    };
    getHotels();
  }, []);
  const [filter, setFilter] = useState({
    guestName: "",
    hotelName: "--select--",
    bookingSource: "--select--",
    serialNumber: "",
    filterBy: "--select--",
    status: "--select--",
    addedBy: "--select--",
    dateRange: {},
  });
  const removeTime = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  return (
    <div className="flex w-full flex-col justify-center gap-4 items-center overflow-hidden">
      <div className="flex w-full justify-between px-2 items-center gap-4 lg:gap-0 mt-6">
        <h1 className="lg:text-2xl text-lg whitespace-nowrap font-bold">
          Booking Details
        </h1>

        <div>
          <div className="flex flex-wrap gap-2">
            {user && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="defaultBtn">Stay</Button>
                  </PopoverTrigger>
                  <PopoverContent className="px-0 py-0 rounded-2xl">
                    <Card shadow="sm" isPressable className="border-none ">
                      <CardBody className="overflow-hidden gap-4">
                        <div>
                          <NextUISelect
                            id="hotel-drop-down"
                            value={filter.hotelName}
                            label="Select hotel"
                            onChange={(e) => {
                              setStayHotels({
                                ...filter,
                                hotelName: e.target.value,
                              });
                            }}
                          >
                            {hotels.map((hotel: any) => (
                              <NextUISelectItem
                                key={hotel._id}
                                value={hotel._id}
                              >
                                {hotel.hotelName}
                              </NextUISelectItem>
                            ))}
                          </NextUISelect>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              color="primary"
                              variant="faded"
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date instanceof Date && !isNaN(date as any) ? (
                                format(date, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="flex w-auto flex-col space-y-2 p-0 ">
                            <Select
                              onValueChange={(value) => {
                                // Use the current date and time if no date is selected
                                const baseDate = new Date(date);

                                const selectedDate = addDays(
                                  baseDate,
                                  parseInt(value),
                                );
                                const dateWithIndianTime =
                                  addIndianTime(selectedDate);
                                setDate(dateWithIndianTime);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="0">Today</SelectItem>
                                <SelectItem value="1">Tomorrow</SelectItem>
                                <SelectItem value="3">In 3 days</SelectItem>
                                <SelectItem value="7">In a week</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="rounded-md border">
                              <Calendars
                                mode="single"
                                selected={date}
                                onSelect={(newDate: any) => {
                                  const selectedDate = removeTime(newDate);
                                  const dateWithIndianTime =
                                    addIndianTime(selectedDate);
                                  setDate(dateWithIndianTime);
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>

                        <Button
                          color="success"
                          variant="bordered"
                          isDisabled={!date}
                          startContent={<Home size={20} />}
                          onClick={() =>
                            getStayBookings(date, stayHotels.hotelName)
                          }
                        >
                          Stay
                        </Button>
                        <Button
                          color="danger"
                          variant="bordered"
                          isDisabled={!date}
                          startContent={<RotateCcw size={20} />}
                          onClick={() => {
                            setStayHotels({
                              hotelName: "--select--",
                            });

                            setFilter({
                              guestName: "",
                              hotelName: "--select--",
                              bookingSource: "--select--",
                              serialNumber: "",
                              filterBy: "--select--",
                              dateRange: {},
                              status: "--select--",
                              addedBy: "--select--",
                            });
                            setStayColor(false);
                            setFilterData({
                              guestName: "",
                              hotelName: "",
                              bookingSource: "",
                              serialNumber: "",
                              filterBy: "",
                              dateRange: {},
                              status: "",
                              addedBy: "",
                            });
                          }}
                        >
                          Reset
                        </Button>
                      </CardBody>
                    </Card>
                  </PopoverContent>
                </Popover>

                <Button
                  onClick={() => setOnFilterOpen(!onFilterOpen)}
                  className="defaultBtn"
                >
                  Filter
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="defaultBtn">
                      <FaCloudUploadAlt size={20} />

                      <p className="whitespace-nowrap text-sm hidden lg:block">
                        Upload Excel
                      </p>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="dark:bg-[#25293c]">
                    <SheetHeader>
                      <div className="flex gap-2">
                        <SheetTitle>Upload Excel</SheetTitle>
                        <SheetTitle>
                          <Button
                            size="sm"
                            color="danger"
                            variant="faded"
                            onClick={resetState}
                            startContent={<ListRestart size={20} />}
                          >
                            Reset
                          </Button>
                        </SheetTitle>
                      </div>
                      <SheetDescription>
                        Make sure the excel file is in the correct format
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Excel File
                        </Label>
                        <Input
                          onChange={readUploadFile}
                          id="name"
                          type="file"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <SheetFooter>
                      <Button
                        color="success"
                        variant="bordered"
                        onClick={handleOnDownload}
                      >
                        <FolderDown />
                        Sample Excel
                      </Button>

                      <SheetClose asChild>
                        <Button
                          type="submit"
                          variant="faded"
                          onClick={handleSaveExcel}
                          startContent={<Save />}
                        >
                          Save Excel
                        </Button>
                      </SheetClose>
                    </SheetFooter>

                    <XlsxTable data={xlsxFile} setXlsxFile={setXlsxFile} />
                  </SheetContent>
                </Sheet>
                <XlsxDangerModal
                  title="Are you sure?"
                  description="This action cannot be undone. This will permanently update the data in your table."
                  onConfirm={handleConfirm}
                  open={isDialogOpen}
                  setOpen={setIsDialogOpen}
                />
                <Button
                  onClick={() => {
                    setShowDownloadPopUp(true);
                  }}
                  className="defaultBtn"
                >
                  <SiMicrosoftexcel size={20} />
                  <p className="whitespace-nowrap text-sm hidden lg:block">
                    Download Excel
                  </p>
                </Button>
              </>
            )}
            <Button
              onClick={() => setShowModal(true)}
              type="submit"
              className="defaultBtn"
            >
              <FaPlus size={20} />
              <p className="whitespace-nowrap text-sm hidden lg:block">
                Add Booking
              </p>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Filter
          usersData={user}
          setStayColor={setStayColor}
          bookingStats={bookingDataStats}
          isFilterOpen={onFilterOpen}
          setFilterData={(filter: any) => {
            setFilterData(filter);
            setReloadData(!reloadData);
            setPage(1);
          }}
        />
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
              disabled={page * PAGE_LIMIT >= bookingCounts}
              onClick={() => setPage(page + 1)}
              className="border p-3 shadow hover:bg-gray-200 cursor-pointer hover:opacity-90 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcNext />
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            getBookingsBySearch(e);
          }}
          className="w-full h-full text-xs md:mt-0"
        >
          <div className="ml-auto border shadow md:w-[500px] mx-1 h-full flex flex-row rounded-md justify-center items-center overflow-hidden">
            <input
              placeholder="Search Bookings..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-full py-4 px-4 dark:bg-[#282f46] outline-none text-gray-700 dark:text-white"
            />
            <button
              className="min-w-[40px] flex justify-center items-center defaultBtn"
              onClick={(e) => {
                getBookingsBySearch(e);
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

      <div className={` flex w-full`}>
        <BookingTable
          date={date}
          stayColor={stayColor}
          owner={user}
          setBookingData={setBookingData}
          setShowModal={(value) => setShowViewModal(value)}
          getBooking={(booking) => setBooking(booking)}
          cancelBookingHandler={cancelBookingHandler}
          undoCancelBookingHandler={undoCancelBookingHandler}
          bookingData={bookingData}
          loading={loading}
        />
      </div>
      <ToastContainer
        theme="dark"
        position="bottom-center"
        autoClose={4000}
        limit={3}
      />
      {showModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          {(accountType === "ADMIN" || accountType === "SUBADMIN") && (
            <InputBooking
              user={user}
              setBookingData={setBookingData}
              onClose={(value) => setShowModal(value)}
            />
          )}
        </div>
      )}
      {showViewModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <ViewBooking
            setShowEditModal={(value) => setShowEditModal(value)}
            cancelBookingHandler={cancelBookingHandler}
            undoCancelBookingHandler={undoCancelBookingHandler}
            onClose={(value) => setShowViewModal(value)}
            booking={booking}
            setEditingBookingData={(value) => setEditingBookingData(value)}
          />
        </div>
      )}
      {showEditModal && editingBookingData && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <EditBooking
            onClose={(value) => setShowEditModal(value)}
            setBookingData={setBookingData}
            editingBookingDataProps={editingBookingData}
            bookingData={bookingData}
            owner={user}
          />
        </div>
      )}
      <div className="z-10 w-full flex flex-row justify-between items-center py-3 ">
        <div>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mr-2 py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page * PAGE_LIMIT >= bookingCounts}
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="text-gray-500 text-sm">
          {" "}
          <div>{`Page ${page} of ${Math.ceil(
            bookingCounts / PAGE_LIMIT,
          )}`}</div>
        </div>
      </div>
      {showDownloadPopUp && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden z-50">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold dark:text-black">
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
    </div>
  );
};

export default Bookings;
