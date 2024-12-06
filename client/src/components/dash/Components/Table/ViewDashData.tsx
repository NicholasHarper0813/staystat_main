import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {selectAllbookings} from "@/lib/features/bookingSlice";
import {selectAllUsers} from "@/lib/features/userSlice";
import {BookingData} from "@/lib/Types/Dashboard/types";
import {HotelData} from "@/lib/Types/Dashboard/types";
import {selectAllhotels} from "@/lib/features/hotelSlice";
import {FaTimes} from "react-icons/fa";

interface Props {
    onClose: (value: boolean) => void;
    variable: string;
}

const ifCheckInToday = [
    "Serial No.", "Hotel Name", 'Guest Name', "Phone Number", 'Booking Amount', 'Number of Persons', 'Number of Rooms', "Number of Days"
]

const ifBookingToday = [
    "Serial No.", "Hotel Name", 'Guest Name', "Phone Number", 'Booking Amount', 'Number of Persons', 'Number of Rooms', "Check-In Date", "Check-Out Date"
]

const ifUser = [
    "Serial No.", "User Name", "Phone Number", 'Hotels Name', 'Email Address'
]

const ifHotels = [
    "Serial No.", "Hotel Name", "Location", 'Owner Name', 'Phone Number'
]
const ifRevenue = [
    "Serial No.", "Hotel Name", "Location", "Revenue"
]
const ifFutureDues = [
    "Serial No.", "Hotel Name", "Location", "Dues"
]


const ViewDashData = ({onClose, variable}: Props) => {
    const [todaysCheckIns, setTodaysCheckIns] = useState<BookingData[]>();
    const [todaysCheckOuts, setTodaysCheckOuts] = useState<BookingData[]>();
    const [todaysBookings, setTodaysBookings] = useState<BookingData[]>();
    const [todaysModificationBooking, setTodaysModification] = useState<BookingData[]>();
    const [todaysCancellation, setTodaysCancellation] = useState<any[]>();
    const [futureDue,setFutureDue] = useState<BookingData[]>();
    const [statusChange,setStatusChange] = useState<boolean>(false)
    const [sortedRevenueArray, setSortedRevenueArray] = useState<any[]>();
    const [sortedDueArray, setSortedDueArray] = useState<any[]>();
    const [sortedUpcomingRevArray, setsortedUpcomingRevArray] = useState<any[]>();

    
    
    const bookingData: BookingData[] = useSelector(selectAllbookings);
    const users = useSelector(selectAllUsers);
    const hotels: HotelData[] = useSelector(selectAllhotels);
    
    const [todaysUser, setTodaysUser] = useState<any[]>();
    
    const [totalHotels, setTotalHotels] = useState<HotelData[]>();
    
    const confirmedFilter = bookingData.filter((item: any) => item.status === "CONFIRMED");

    useEffect(()=>{
        const activeUsers = users.filter((item: any) => item.isActive === true);
    setTodaysUser(activeUsers)
    const activeHotels = hotels.filter((item: any) => item.isActive === true);
    setTotalHotels(activeHotels)


    },[])


    const currentDate = new Date();
    //✅ Step-1 -> Calculate the number of check-ins for today
    const numberOfTodaysCheckIns = confirmedFilter.filter((record: any) => {
        const checkInDate: string = record.checkInDate.split("T")[0];
        return new Date(checkInDate).toISOString().split("T")[0] ===
            new Date(currentDate).toISOString().split("T")[0];
    });

    const numberOfTodaysCheckOuts = confirmedFilter.filter((record: any) => {
        const checkOutDate: string = record.checkOutDate.split("T")[0];
        return new Date(checkOutDate).toISOString().split("T")[0] ===
            new Date(currentDate).toISOString().split("T")[0];
    });

    const today: string = new Date().toISOString().split("T")[0];

    const todaysBooking: BookingData[] = confirmedFilter.filter((record) => {
        const createdAtDate: Date = new Date(record.createdAt);
        const TodaysDate: string = createdAtDate.toISOString().split("T")[0];
        return TodaysDate === today;
    });

    function getModified(bookingData: BookingData[]):any {

        const todaysModification: BookingData[] = bookingData.filter((record) => {
            const currentDate: string = new Date(record.createdAt).toISOString()
            const ModifiedDate: string = new Date(record.updatedAt).toISOString()
            return ModifiedDate != currentDate;
        });

        return todaysModification;
    }



    let todaysModification:any = getModified(confirmedFilter);

    todaysModification = todaysModification.filter((item: any) =>     {
        const ModifiedDate: string = new Date(item.updatedAt).toISOString().split("T")[0]
        return ModifiedDate == new Date().toISOString().split("T")[0];
    });

    // const todaysModification: BookingData[] = confirmedFilter.filter((record) => {
    //     const ModifiedDate: string = new Date(record.updatedAt).toISOString().split("T")[0]
    //     return ModifiedDate == new Date().toISOString().split("T")[0];
    // });

    const totalCancellation = bookingData.filter((record: any) => {
            return record.status === "CANCELLED";
        }
    );

    const todayCancellations = totalCancellation.filter(item => {
        const createdDate = new Date(item.createdAt);
        // @ts-ignore
        return new Date(createdDate).toISOString().split("T")[0] ===
            new Date(currentDate).toISOString().split("T")[0];
    });


    const statusChnageHandler = (type: string, status:string) => {
        setStatusChange(!statusChange)
        if(type === "Total Users") {
           
            if(status === "ACTIVE") {
     

                const activeUsers = users.filter((item: any) => item.isActive === true);
                setTodaysUser(activeUsers)
            } else {
                const deactiveUsers = users.filter((item: any) => item.isActive === false)
                
                setTodaysUser(deactiveUsers)
            }
        } else {
            if(status === "ACTIVE") {
                const activeHotels = hotels.filter((item: any) => item.isActive === true);
                setTotalHotels(activeHotels)
            } else {
                const deactiveHotels = hotels.filter((item: any) => item.isActive === false)
                setTotalHotels(deactiveHotels)
            }
        }
    }





    const bookingSource: string[] = confirmedFilter.map((item: any) => item?.bookingSource);
    const bookingAmountBar: number[] = confirmedFilter.map((item: any) => item?.bookingAmount);
    const createdDate: string[] = confirmedFilter.map((item: any) => item?.createdAt);
    const hotelNames: string[] = confirmedFilter.map((item: any) => item?.hotel);
    // console.log(hotelNames, "hotelNames")
    const userName: string[] = confirmedFilter.map((item: any) => item?.bookingBy);
    const locationName: string[] = confirmedFilter.map((item: any) => item?.hotel?.location);

    const currentDateForDue: string = new Date().toISOString();

    const futureBookingsForDue = confirmedFilter.filter(
        (record:any): boolean => {
            const checkInDateForDue: string =
                new Date(record.checkInDate).toISOString();
            return checkInDateForDue > currentDateForDue;
        },
    );

    const userDeactive =  users.filter((item: any) => item.isActive === true);

    const hotelDeactive =  hotels.filter((item: any) => item.isActive === true);

    useEffect(() => {
        let bookingArray:any[] = [];
        let duesArray :any[] = [];
        let futureRevenueArray:any[] = [];

        todaysBooking.map((item: any,index:number) => {
        // Check if a record with the same hotel name exists in the array
        const hotelName = item.hotel.hotelName;
        // console.log(hotelName, "hotelName")
        const hotelIndex = bookingArray.findIndex((item: any) => item.hotelName === hotelName);
        // console.log(hotelIndex, "hotelIndex")

        // If the hotel name exists, add the amount to the existing amount
        if (hotelIndex !== -1) {
            bookingArray[hotelIndex].bookingAmount += item.bookingAmount;
            // console.log(bookingArray[hotelIndex].bookingAmount, "bookingArray[hotelIndex].bookingAmount")
        } else {
            // If the hotel name does not exist, add a new record to the array
            bookingArray.push({
                hotelName: item.hotel.hotelName,
                bookingAmount: item.bookingAmount,
                location: item.hotel.location,
            });
        }
    });

    futureBookingsForDue.map((item: any,index:number) => {
        // Check if a record with the same hotel name exists in the array
        const hotelName = item.hotel.hotelName;
        // console.log(hotelName, "hotelName")
        const hotelIndex = futureRevenueArray.findIndex((item: any) => item.hotelName === hotelName);
        // console.log(hotelIndex, "hotelIndex")

        // If the hotel name exists, add the amount to the existing amount
        if (hotelIndex !== -1) {
            futureRevenueArray[hotelIndex].bookingAmount += item.bookingAmount;
            // console.log(bookingArray[hotelIndex].bookingAmount, "bookingArray[hotelIndex].bookingAmount")
        } else {
            // If the hotel name does not exist, add a new record to the array
            futureRevenueArray.push({
                hotelName: item.hotel.hotelName,
                bookingAmount: item.bookingAmount,
                location: item.hotel.location,
            });
        }
    });

    futureBookingsForDue.map((item: any,index:number) => {
        // Check if a record with the same hotel name exists in the array
        const hotelName = item.hotel.hotelName;
        // console.log(hotelName, "hotelName")
        const hotelIndex = duesArray.findIndex((item: any) => item.hotelName === hotelName);
        // console.log(hotelIndex, "hotelIndex")

        // If the hotel name exists, add the amount to the existing amount
        if (hotelIndex !== -1) {
            duesArray[hotelIndex].dueAmount += item.dueAmount;
            // console.log(bookingArray[hotelIndex].bookingAmount, "bookingArray[hotelIndex].bookingAmount")
        } else {
            // If the hotel name does not exist, add a new record to the array
            duesArray.push({
                hotelName: item.hotel.hotelName,
                dueAmount: item.dueAmount,
                location: item.hotel.location,
            });
        }
    });


        setSortedRevenueArray(bookingArray)
        setsortedUpcomingRevArray(futureRevenueArray)
        setSortedDueArray(duesArray)
        

    // console.log(bookingArray, "bookingArray")
    },[])



    useEffect(() => {

        // console.log("Chnages")
            setTodaysCheckIns(numberOfTodaysCheckIns);
            setTodaysCheckOuts(numberOfTodaysCheckOuts);
            setTodaysBookings(todaysBooking);
            setTodaysModification(todaysModification);
            // setTodaysUser(users);
            setTodaysCancellation(todayCancellations);
            // setTotalHotels(hotelDeactive);
            setFutureDue(futureBookingsForDue)
            

            }, [numberOfTodaysCheckIns, numberOfTodaysCheckOuts, todaysBooking, todaysModification, users, totalCancellation, hotels,todaysUser,totalHotels]);


    return (
        <>

            <div
                className=" max-h-[80%] overflow-y-scroll max-w-[90%] lg:max-w-screen-2xl absolute items-center  border border-r border-gray-300/25 rounded-xl shadow md:flex-row  dark:border-gray-700 ">
                <TailwindWrapper>
                    <h1 className="text-center mx-auto text-xl font-bold my-2">{variable}</h1>
                    <button>
                        <FaTimes
                            className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => onClose(false)}/>
                    </button>
                   {
                    variable === "Total Users" && (
                        <div className="flex justify-start gap-2 mb-2 items-center">
                   <label
            htmlFor="plan"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Status :
          </label>
                   <select
            required
            onChange={(e) => statusChnageHandler("Total Users", e.target.value)}
            id="plan"
            name="plan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            
            <option value="ACTIVE">ACTIVE</option>
            <option value="DEACTIVE">DEACTIVE</option>
          
          </select>
                   </div>
                    )
                   }
                   {
                    variable === "Total Hotels" && (
                        <div className="flex justify-start gap-2 mb-2 items-center">
                   <label
            htmlFor="plan"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Status :
          </label>
                   <select
            required
            onChange={(e) => statusChnageHandler("Total Hotels", e.target.value)}
            id="plan"
            name="plan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            
            <option value="ACTIVE">ACTIVE</option>
            <option value="DEACTIVE">DEACTIVE</option>
          
          </select>
                   </div>
                    )
                   }
                    <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg cursor-pointer">
                        <table
                            className="p-4 w-full  text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
                            <thead className="text-sm text-gray-900 uppercase dark:text-gray-400">
                            <tr className="whitespace-nowrap">
                                {
                                    variable === "Today's Check-Ins" && ifCheckInToday.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }
                                {
                                    variable === "Today's Check-Outs" && ifCheckInToday.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }
                                {
                                    variable === "Today's Booking" && ifBookingToday.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }
                                {
                                    variable === "Today's Modification" && ifBookingToday.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }
                                {
                                    variable === "Total Users" && ifUser.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }
                                {
                                    variable === "Today's Cancellation" && ifBookingToday.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }

                                {
                                    variable === "Total Hotels" && ifHotels.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }
                                {
                                    variable === "Today's Revenue" && ifRevenue.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }
                                {
                                    variable === "Upcoming Revenue" && ifRevenue.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }
                                {
                                    variable === "Future Dues" && ifFutureDues.map((_, i) => (
                                        <th key={i} scope="col" className="px-4 py-2 text-center">
                                            {_}
                                        </th>
                                    ))
                                }

                            </tr>
                            </thead>
                            <tbody className="rounded-xl">
                            {
                                variable === "Today's Check-Ins" &&
                                todaysCheckIns?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotel.hotelName}
                                        </td>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.guestName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.contactNumber}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.bookingAmount}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfPersons}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfRooms}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {new Date(_.checkOutDate).getDate() - new Date(_.checkInDate).getDate()}
                                        </td>


                                    </tr>
                                ))

                            }


                            {
                                variable === "Today's Check-Outs" &&
                                todaysCheckOuts?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotel.hotelName}
                                        </td>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.guestName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.contactNumber}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.bookingAmount}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfPersons}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfRooms}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {new Date(_.checkOutDate).getDate() - new Date(_.checkInDate).getDate()}
                                        </td>


                                    </tr>
                                ))
                            }

                            {
                                variable === "Today's Booking" &&
                                todaysBookings?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotel.hotelName}
                                        </td>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.guestName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.contactNumber}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.bookingAmount}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfPersons}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfRooms}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {`${new Date(_.checkInDate).getDate()} / ${new Date(_.checkInDate).getMonth() +1} / ${new Date(_.checkInDate).getFullYear()}` }
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                        {`${new Date(_.checkOutDate).getDate()} / ${new Date(_.checkOutDate).getMonth() +1} / ${new Date(_.checkOutDate).getFullYear()}` }
                                        </td>


                                    </tr>
                                ))
                            }

                            {
                                variable === "Today's Modification" &&
                                todaysModificationBooking?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotel.hotelName}
                                        </td>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.guestName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.contactNumber}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.bookingAmount}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfPersons}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfRooms}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                        {`${new Date(_.checkInDate).getDate()} / ${new Date(_.checkInDate).getMonth() +1} / ${new Date(_.checkInDate).getFullYear()}` }
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                        {`${new Date(_.checkOutDate).getDate()} / ${new Date(_.checkOutDate).getMonth() +1} / ${new Date(_.checkOutDate).getFullYear()}` }
                                        </td>


                                    </tr>
                                ))
                            }

                            {
                                variable === "Total Users" &&
                                todaysUser && todaysUser.length > 0 && todaysUser?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.name}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.phoneNumber}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.hotel.map((hotel: any) => hotel.hotelName).join(", ")}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.email}
                                        </td>
                                    </tr>
                                ))}

                            {
                                variable === "Today's Cancellation" &&
                                todaysCancellation?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotel.hotelName}
                                        </td>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.guestName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.contactNumber}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.bookingAmount}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfPersons}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.numberOfRooms}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                        {`${new Date(_.checkInDate).getDate()} / ${new Date(_.checkInDate).getMonth() +1} / ${new Date(_.checkInDate).getFullYear()}` }
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                        {`${new Date(_.checkOutDate).getDate()} / ${new Date(_.checkOutDate).getMonth() +1} / ${new Date(_.checkOutDate).getFullYear()}` }
                                        </td>


                                    </tr>
                                ))
                            }

                            {
                                variable === "Today's Revenue" &&
                                sortedRevenueArray?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotelName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {/* @ts-ignore */}
                                            {_.location}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.bookingAmount}
                                        </td>
                                        
                                    </tr>
                                ))}
                                {
                                variable === "Upcoming Revenue" &&
                                sortedUpcomingRevArray?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotelName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {/* @ts-ignore */}
                                            {_.location}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.bookingAmount}
                                        </td>
                                        
                                    </tr>
                                ))}
                                {
                                variable === "Future Dues" &&
                                sortedDueArray?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotelName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {/* @ts-ignore */}
                                            {_.location}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.dueAmount}
                                        </td>
                                        
                                    </tr>
                                ))}

                            {
                                variable === "Total Hotels" &&
                                totalHotels?.map((_, i) => (
                                    <tr
                                        title="Click to view user details"
                                        key={i}

                                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {i + 1}
                                        </th>
                                        <td

                                            className="text-center px-4 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                        >
                                            {_.hotelName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.location}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.ownerName}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {_.frontOfficeContact}
                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                    </div>


                </TailwindWrapper>

            </div>


        </>
    );
};

export default ViewDashData;
  