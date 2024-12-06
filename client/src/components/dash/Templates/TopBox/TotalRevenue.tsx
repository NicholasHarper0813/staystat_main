import {useSelector} from "react-redux";
import { selectAllbookings} from "@/lib/features/bookingSlice";
import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import ChartBox from "@/components/dash/Components/ChartBox/ChartBox";

const TotalRevenue= () => {
  let bookingData  = useSelector(selectAllbookings)
  bookingData = bookingData.filter((item: any) => item.status === "CONFIRMED");

  const currentDate = new Date();
  const todaysItems = bookingData.filter((item:any) => {
    const checkInDate: string = item.createdAt.split("T")[0];
    return new Date(checkInDate).toISOString().split("T")[0] ===
        new Date(currentDate).toISOString().split("T")[0];
  });

  //if there is no booking today
  const todaysRevenu = todaysItems.reduce((total: any, item: any) => {
    return total + item.bookingAmount; // Use 'item.bookingAmount' instead of 'total.bookingAmount'
  }, 0);


  const endOfWeek = new Date();
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(currentDate.getDate() - 6); // End of the week


  // //@ts-ignore
  // const thisWeekItems = bookingData.filter(item => {
  //   const Dates:Date = new Date(item.createdAt);
  //   return Dates <= currentDate && Dates >= endOfWeek;
  // });
  const thisWeekItems = bookingData.filter((record:any) => {
    const checkInDate = new Date(record.createdAt);
    return checkInDate <= currentDate && checkInDate >= endOfWeek;
  });


  const thisWeekRevenue = thisWeekItems.reduce((total: any, item: any) => {
    return total + item.bookingAmount; // Use 'item.bookingAmount' instead of 'total.bookingAmount'
  }, 0);



  const chartData = [
    { name: "Sun", Revenue: 0 },
    { name: "Mon", Revenue: 0 },
    { name: "Tue", Revenue: 0 },
    { name: "Wed", Revenue: 0 },
    { name: "Thu", Revenue: 0 },
    { name: "Fri", Revenue: 0 },
    { name: "Sat", Revenue: 0 },
  ];

  thisWeekItems.forEach((record:any) => {
    const cancelDate = new Date(record.createdAt);
    const dayOfWeek = cancelDate.getDay(); // 0 for Sunday, 1 for Monday, and so on
    // Increment the Revenue for the corresponding day in chartData
    chartData[dayOfWeek].Revenue += record.bookingAmount;
  });

  const TodaysBooking:any = {
    color: "#8884d8",
    icon: "/userIcon.svg",
    title: "Today's Revenue",
    number: todaysRevenu,
    dataKey: "Revenue",
    percentage: thisWeekRevenue,
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
};

export default TotalRevenue;
