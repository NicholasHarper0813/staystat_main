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
import BarChartComponent from "@/components/dash/Templates/BottomBox/HotelPerformance/BarChartComponent";

interface RevenueBarChartProps {
  data: {
    hotelName: string;
    bookingAmount: number;
    createdAt: string;
  }[];
}

const RevenueBarChartBATLM: React.FC<RevenueBarChartProps> = ({ data }) => {
  // Calculate the start and end dates for the last month
  const currentDate = new Date();
  const startOfLastMonth = startOfMonth(subMonths(currentDate, 1));
  const endOfLastMonth = endOfMonth(subMonths(currentDate, 1));

  // Create a dictionary to aggregate booking amounts for each source within the last month
  const aggregateData: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startOfLastMonth, end: endOfLastMonth })) {
      const source = item.hotelName;
      if (aggregateData[source]) {
        aggregateData[source] += item.bookingAmount;
      } else {
        aggregateData[source] = item.bookingAmount;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
      new Set(data.map((item) => item.hotelName)),
  );

  // Create a chartData array with all unique sources and their aggregated revenue for the last month
  const chartData = uniqueSources.map((source) => ({
    source,
    Revenue: aggregateData[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"Revenue"} />
  );
};

export default RevenueBarChartBATLM;
