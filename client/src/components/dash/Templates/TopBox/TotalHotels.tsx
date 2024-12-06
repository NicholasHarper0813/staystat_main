import ChartBox from "@/components/dash/Components/ChartBox/ChartBox";
import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import {HotelData} from "@/lib/Types/Dashboard/types";
import {useSelector} from "react-redux";
import { selectAllhotels} from "@/lib/features/hotelSlice";

function TotalHotels() {
    let hotels: HotelData[] = useSelector(selectAllhotels);
    // hotels = hotels.filter((item: any) => item.status === "CONFIRMED");

    function calculateTotalHotels(hotels:any) {
        //@ts-ignore
        return hotels
    }

    const currentDate2 = new Date();

    const endOfWeek = new Date();
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(currentDate2.getDate() - 6); // End of the week

    // Filter bookings for today and this week
    //@ts-ignore
    const totalHotels = calculateTotalHotels(hotels);


    //@ts-ignore
    const newHotels = totalHotels.filter(item => {
        const createdDate = new Date(item.createdAt);
        return createdDate <= currentDate2 && createdDate >= endOfWeek;
    });

    let thisWeeknewHotels= newHotels.length;

    let chartData = [
        { name: "Sun", Hotels: 0 },
        { name: "Mon", Hotels: 0 },
        { name: "Tue", Hotels: 0 },
        { name: "Wed", Hotels: 0 },
        { name: "Thu", Hotels: 0 },
        { name: "Fri", Hotels: 0 },
        { name: "Sat", Hotels: 0 },
    ];

    newHotels.forEach((record:any) => {
        const cancelDate = new Date(record.createdAt);
        const dayOfWeek = cancelDate.getDay(); // 0 for Sunday, 1 for Monday, and so on// Increment the cancellations count for the corresponding day in chartData
        chartData[dayOfWeek].Hotels++;
    });

     const TotalHotels = {
        color: "#8884d8",
        icon: "/userIcon.svg",
        title: "Total Hotels",
        number: totalHotels.length,
        dataKey: "Hotels",
        percentage: thisWeeknewHotels,
        reactIcon: "BsCalendar2Date",
        chartData: chartData
    };

    return (
        <TailwindWrapper className={"mt-5 justify-self-center"}>
            <div className="box box2">
                <ChartBox titleOfPercentage="Last 7 days" {...TotalHotels} />
            </div>
        </TailwindWrapper>
    );
}

export default TotalHotels;