import React from "react";
import { format, isSameDay } from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/UserPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    userName: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartBCT: React.FC<BookingCountBarChartProps> = ({
  data,
}) => {
  // Create a dictionary to count the number of bookings for each source
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    if (isSameDay(new Date(item.createdAt), new Date())) {
      const source = item.userName;
      if (bookingCounts[source]) {
        bookingCounts[source]++;
      } else {
        bookingCounts[source] = 1;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
    new Set(data.map((item) => item.userName)),
  );

  // Create a chartData array with all unique sources and their booking counts for today
  const chartData = uniqueSources.map((source) => ({
    source,
    BookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"BookingCount"} />
  );
};

export default BookingCountBarChartBCT;
