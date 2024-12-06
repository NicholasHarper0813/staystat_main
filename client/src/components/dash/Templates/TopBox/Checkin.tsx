import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import ChartBox from "@/components/dash/Components/ChartBox/ChartBox";
import {useSelector} from "react-redux";
import {selectAllbookings} from "@/lib/features/bookingSlice";
import {BookingData} from "@/lib/Types/Dashboard/types";
import {useEffect} from "react";
import {AppDispatch} from "@/lib/redux/store";
import {useDispatch} from "react-redux";
import {fetchAllBookingsAsync} from "@/lib/features/bookingSlice";

export const Checkin=() => {
    let bookingData:BookingData[] = useSelector(selectAllbookings);
    bookingData = bookingData.filter((item: any) => item.status === "CONFIRMED");

    const currentDate = new Date();
    //✅ Step-1 -> Calculate the number of check-ins for today
    const numberOfTodaysCheckIns = bookingData.filter((record:any) => {
        const checkInDate: string = record.checkInDate.split("T")[0];
        return new Date(checkInDate).toISOString().split("T")[0] ===
            new Date(currentDate).toISOString().split("T")[0];
    });
    const todaysCheckIns = numberOfTodaysCheckIns.length;

    //✅ Step-2 -> Calculate the number of check-ins for this Week
    const currentDate2 = new Date();
    // Assuming Sunday is the first day of the week

    const endOfWeek = new Date();
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(currentDate2.getDate() - 6); // End of the week

    // Filter the original data for this week's check-ins
    const thisWeekCheckIns = bookingData.filter((record:any) => {
        const checkInDate = new Date(record.checkInDate);
        return checkInDate <= currentDate2 && checkInDate >= endOfWeek;
    });

// Initialize an array to represent the desired format for chartData
    const chartData = [
        { name: "Sun", CheckIns: 0 },
        { name: "Mon", CheckIns: 0 },
        { name: "Tue", CheckIns: 0 },
        { name: "Wed", CheckIns: 0 },
        { name: "Thu", CheckIns: 0 },
        { name: "Fri", CheckIns: 0 },
        { name: "Sat", CheckIns: 0 },
    ];

    // Calculate the total number of users for each day of the current week
    thisWeekCheckIns.forEach((record:any) => {
        const checkInDate = new Date(record.checkInDate);
        const dayOfWeek = checkInDate.getDay(); // 0 for Sunday, 1 for Monday, and so on
        // Increment the users count for the corresponding day in chartData
        chartData[dayOfWeek].CheckIns++;
    });

    let Checkin={
        color: "#8884d8",
        icon: "/userIcon.svg",
        title: "Today's Check-Ins",
        number: todaysCheckIns,
        dataKey: "CheckIns",
        percentage: thisWeekCheckIns.length,
        reactIcon: "BsCalendar2Date",
        chartData: chartData
    }

    return(
        <TailwindWrapper className={"mt-5 justify-self-center"}>
            <div className="box box2">
                <ChartBox titleOfPercentage="Last 7 days" {...Checkin} />
            </div>
        </TailwindWrapper>
    );
};

export default Checkin;