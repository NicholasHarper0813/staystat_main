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
  isWithinInterval,
  subDays,
  startOfYear,
  endOfYear,
  subYears,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/LocationPerformance/BarChartComponent";

interface RevenueBarChartProps {
  data: {
    locationName: string;
    bookingAmount: number;
    createdAt: string;
  }[];
}

const RevenueBarChartPreviousYear: React.FC<RevenueBarChartProps> = ({ data }) => {
  // Calculate the start and end dates for the previous year
  const currentDate = new Date();
  const startOfPreviousYear = startOfYear(subYears(currentDate, 1));
  const endOfPreviousYear = endOfYear(subYears(currentDate, 1));

  // Create a dictionary to aggregate booking amounts for each source within the previous year
  const aggregateData: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startOfPreviousYear, end: endOfPreviousYear })) {
      const source = item.locationName;
      if (aggregateData[source]) {
        aggregateData[source] += item.bookingAmount;
      } else {
        aggregateData[source] = item.bookingAmount;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
      new Set(data.map((item) => item.locationName)),
  );

  // Create a chartData array with all unique sources and their aggregated revenue for the previous year
  const chartData = uniqueSources.map((source) => ({
    source,
    Revenue: aggregateData[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"Revenue"} />
  );
};

export default RevenueBarChartPreviousYear;
