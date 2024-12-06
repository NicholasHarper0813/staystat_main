import ChartBox from "@/components/dash/Components/ChartBox/ChartBox";
import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import { BookingData } from "@/lib/Types/Dashboard/types";
import { useSelector } from "react-redux";
import { selectAllbookings } from "@/lib/features/bookingSlice";

function getModified(bookingData: BookingData[]):any {

  const todaysModification: BookingData[] = bookingData.filter((record) => {
    const currentDate: string = new Date(record.createdAt).toISOString()
    const ModifiedDate: string = new Date(record.updatedAt).toISOString()
    return ModifiedDate != currentDate;
  });

  return todaysModification;
}

function TodaysModifiedBooking() {
  let bookingData: BookingData[] = useSelector(selectAllbookings);
  bookingData = bookingData.filter((item: any) => item.status === "CONFIRMED");

  let todaysModification:any = getModified(bookingData);

  todaysModification = todaysModification.filter((item: any) =>     {
    const ModifiedDate: string = new Date(item.updatedAt).toISOString().split("T")[0]
    return ModifiedDate == new Date().toISOString().split("T")[0];
  });

  const chartData = [
    { name: "Sun", Bookings: 0 },
    { name: "Mon", Bookings: 0 },
    { name: "Tue", Bookings: 0 },
    { name: "Wed", Bookings: 0 },
    { name: "Thu", Bookings: 0 },
    { name: "Fri", Bookings: 0 },
    { name: "Sat", Bookings: 0 },
  ];

  const currentDate = new Date();
  const startOfTheWeek = new Date(currentDate);
  startOfTheWeek.setHours(23, 59, 59, 999);
  startOfTheWeek.setDate(currentDate.getDate() - 6);

  //booking is not taken because need to get all the records after today which is provided by todaysModification
  //it's actually after today remaning modification
  let thisWeekModifiedBookings = getModified(bookingData)
  thisWeekModifiedBookings = thisWeekModifiedBookings.filter((record:any) => {
    const ModifiedDate = new Date(record.updatedAt).toISOString().split("T")[0];
    const currentDate2 = currentDate.toISOString().split("T")[0];
    const startOfTheWeek2 = startOfTheWeek.toISOString().split("T")[0];
    return ModifiedDate <= currentDate2 && ModifiedDate >= startOfTheWeek2;
  });



  thisWeekModifiedBookings.forEach((record:any) => {
    const ModifiedDate = new Date(record.updatedAt);
    const dayOfWeek = ModifiedDate.getDay();
    chartData[dayOfWeek].Bookings++;
  });

  const TodaysModifiedBooking = {
    color: "#8884d8",
    icon: "/userIcon.svg",
    title: "Today's Modification",
    number: todaysModification.length,
    dataKey: "Bookings",
    percentage: thisWeekModifiedBookings.length,
    reactIcon: "BsCalendar2Date",
    chartData: chartData,
  };

  return (
      <TailwindWrapper className="mt-5 justify-self-center">
        <div className="box box2">
          <ChartBox titleOfPercentage="Last 7 days" {...TodaysModifiedBooking} />
        </div>
      </TailwindWrapper>
  );
}

export default TodaysModifiedBooking;
