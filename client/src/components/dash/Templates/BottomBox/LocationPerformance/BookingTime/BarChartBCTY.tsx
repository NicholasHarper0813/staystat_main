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
  subDays,
  startOfYear,
  endOfYear,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/LocationPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    locationName: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartBCTY: React.FC<BookingCountBarChartProps> = ({
                                                                         data,
                                                                       }) => {
  // Calculate the start and end dates for the current year
  const currentDate = new Date();
  const startOfCurrentYear = startOfYear(currentDate);
  const endOfCurrentYear = endOfYear(currentDate);

  // Create a dictionary to count the number of bookings for each source within the current year
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    // Check if the date is within the interval of the current year
    if (isWithinInterval(itemDate, { start: startOfCurrentYear, end: endOfCurrentYear })) {
      const source = item.locationName;
      if (bookingCounts[source]) {
        bookingCounts[source]++;
      } else {
        bookingCounts[source] = 1;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
      new Set(data.map((item) => item.locationName)),
  );

  // Create a chartData array with all unique sources and their booking counts for the current year
  const chartData = uniqueSources.map((source) => ({
    source,
    BookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"BookingCount"} />
  );
};

export default BookingCountBarChartBCTY;
