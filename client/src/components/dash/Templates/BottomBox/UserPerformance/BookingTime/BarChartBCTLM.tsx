import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  isWithinInterval,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/UserPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    userName: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartBCTM: React.FC<BookingCountBarChartProps> = ({
                                                                         data,
                                                                       }) => {
  // Calculate the start and end dates for the previous month
  const currentDate = new Date();
  const startOfPreviousMonth = startOfMonth(subMonths(currentDate, 1));
  const endOfPreviousMonth = endOfMonth(subMonths(currentDate, 1));

  // Create a dictionary to count the number of bookings for each source within the previous month
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startOfPreviousMonth, end: endOfPreviousMonth })) {
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

  // Create a chartData array with all unique sources and their booking counts for the previous month
  const chartData = uniqueSources.map((source) => ({
    source,
    BookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"BookingCount"} />
  );
};

export default BookingCountBarChartBCTM;
