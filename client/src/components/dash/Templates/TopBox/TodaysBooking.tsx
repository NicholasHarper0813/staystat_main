import ChartBox from "@/components/dash/Components/ChartBox/ChartBox";
import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import { BookingData } from "@/lib/Types/Dashboard/types";
import { useSelector } from "react-redux";
import { selectAllbookings } from "@/lib/features/bookingSlice";

function calculateTodaysBooking(bookingData: BookingData[]): number {
  const currentDate: string = new Date().toISOString().split("T")[0];

  const todaysBooking: BookingData[] = bookingData.filter((record) => {
    const createdAtDate: Date = new Date(record.createdAt);
    const TodaysDate: string = createdAtDate.toISOString().split("T")[0];
    return TodaysDate === currentDate;
  });

  return todaysBooking.length;
}

function calculateThisWeekBookings(
  bookingData: BookingData[],
  startOfWeek: Date,
  endOfWeek: Date,
): BookingData[] {
  return bookingData.filter((record) => {
    const createdAtDate: Date = new Date(record.createdAt);
    return createdAtDate >= startOfWeek && createdAtDate <= endOfWeek;
  });
}

function TodaysBooking() {
  let bookingData: BookingData[] = useSelector(selectAllbookings);
  bookingData = bookingData.filter((item: any) => item.status === "CONFIRMED");

  const todaysBooking: number = calculateTodaysBooking(bookingData);

  const currentDate = new Date();

  const endOfWeek = new Date(currentDate);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(currentDate.getDate() - 6);

  const thisWeekBookings = bookingData.filter((record:any) => {
    const checkInDate = new Date(record.createdAt);
    return checkInDate <= currentDate && checkInDate >= endOfWeek;
  });
  const thisWeekBooking: number = thisWeekBookings.length;

  const chartData = [
    { name: "Sun", Bookings: 0 },
    { name: "Mon", Bookings: 0 },
    { name: "Tue", Bookings: 0 },
    { name: "Wed", Bookings: 0 },
    { name: "Thu", Bookings: 0 },
    { name: "Fri", Bookings: 0 },
    { name: "Sat", Bookings: 0 },
  ];

  thisWeekBookings.forEach((record) => {
    const createdAtDate: Date = new Date(record.createdAt);
    const dayOfWeek = createdAtDate.getDay();
    chartData[dayOfWeek].Bookings++;
  });


  const TodaysBooking = {
    color: "#8884d8",
    icon: "/userIcon.svg",
    title: "Today's Booking",
    number: todaysBooking,
    dataKey: "Bookings",
    percentage: thisWeekBooking,
    reactIcon: "BsCalendar2Date",
    chartData: chartData,
  };

  return (
    <TailwindWrapper className="mt-5 justify-self-center">
      <div className="box box2">
        <ChartBox titleOfPercentage="Last 7 days" {...TodaysBooking} />
      </div>
    </TailwindWrapper>
  );
}

export default TodaysBooking;
