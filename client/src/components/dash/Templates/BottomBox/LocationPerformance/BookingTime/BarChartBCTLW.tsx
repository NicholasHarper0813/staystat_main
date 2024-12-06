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
  subWeeks,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/LocationPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    locationName: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartBCTLW: React.FC<BookingCountBarChartProps> = ({
                                                                          data,
                                                                        }) => {
  // Calculate the start and end dates for the last week (previous 7 days excluding the current week)
  const currentDate = new Date();
  const endDate = startOfWeek(currentDate);
  const startDate = startOfWeek(subWeeks(currentDate, 1));

  // Create a dictionary to count the number of bookings for each source within the last week
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startDate, end: endDate })) {
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

  // Create a chartData array with all unique sources and their booking counts for the last week
  const chartData = uniqueSources.map((source) => ({
    source,
    BookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"BookingCount"} />
  );
};

export default BookingCountBarChartBCTLW;
