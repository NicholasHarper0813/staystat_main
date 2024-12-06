import React from "react";
import {
  isWithinInterval,
  startOfYear,
  endOfYear,
  subYears,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/UserPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    userName: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartPreviousYear: React.FC<BookingCountBarChartProps> = ({
                                                                                 data,
                                                                               }) => {
  // Calculate the start and end dates for the previous year
  const currentDate = new Date();
  const startOfPreviousYear = startOfYear(subYears(currentDate, 1));
  const endOfPreviousYear = endOfYear(subYears(currentDate, 1));

  // Create a dictionary to count the number of bookings for each source within the previous year
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startOfPreviousYear, end: endOfPreviousYear })) {
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

  // Create a chartData array with all unique sources and their booking counts for the previous year
  const chartData = uniqueSources.map((source) => ({
    source,
    BookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"BookingCount"} />
  );
};

export default BookingCountBarChartPreviousYear;
