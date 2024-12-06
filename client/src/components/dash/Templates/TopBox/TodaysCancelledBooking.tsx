import ChartBox from "@/components/dash/Components/ChartBox/ChartBox";
import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import {useSelector} from "react-redux";
import {selectAllbookings} from "@/lib/features/bookingSlice";


function TotalUsers() {
    let bookings =  useSelector(selectAllbookings);

    function calculateTotalCancellation(bookings:any) {
        //@ts-ignore
        return bookings.filter(item => item.status === "CANCELLED");
    }

    const currentDate2 = new Date();

    const endOfWeek = new Date(currentDate2);
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(currentDate2.getDate() - 6); // End of the week

    // Filter bookings for today and this week
    //@ts-ignore
    const cancelledBookings = calculateTotalCancellation(bookings);

    // Filter for today's cancellations
    //@ts-ignore
    const todayCancellations = cancelledBookings.filter(item => {
        const createdDate = new Date(item.updatedAt);
        // @ts-ignore
        return new Date(createdDate).toISOString().split("T")[0] ===
            new Date(currentDate2).toISOString().split("T")[0];
    });


    // Filter for this week's cancellations
    //@ts-ignore
    const weekCancellations = cancelledBookings.filter(item => {
        const cancelDate = new Date(item.updatedAt);
        return cancelDate <= currentDate2 && cancelDate >= endOfWeek;
    });

    let todaysCancellation = todayCancellations.length;
    let thisweekCancellation= weekCancellations.length;


    let chartData = [
        { name: "Sun", Bookings: 0 },
        { name: "Mon", Bookings: 0 },
        { name: "Tue", Bookings: 0 },
        { name: "Wed", Bookings: 0 },
        { name: "Thu", Bookings: 0 },
        { name: "Fri", Bookings: 0 },
        { name: "Sat", Bookings: 0 },
    ];

    weekCancellations.forEach((record:any) => {
        const cancelDate = new Date(record.updatedAt);
        const dayOfWeek = cancelDate.getDay(); // 0 for Sunday, 1 for Monday, and so on// Increment the cancellations count for the corresponding day in chartData
        chartData[dayOfWeek].Bookings++;
    });

    const TotalUsersData = {
        color: "#8884d8",
        icon: "/userIcon.svg",
        title: "Today's Cancellation",
        number: todaysCancellation,
        dataKey: "Bookings",
        percentage: thisweekCancellation,
        reactIcon: "BsCalendar2Date",
        chartData: chartData
    };

    return (
        <TailwindWrapper className={"mt-5 justify-self-center"}>
            <div className="box box2">
                <ChartBox titleOfPercentage="Last 7 days" {...TotalUsersData} />
            </div>
        </TailwindWrapper>
    );
}

export default TotalUsers;
