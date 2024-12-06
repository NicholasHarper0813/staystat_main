import React from "react";
import {
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  subDays,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/OtaPerformance/BarChartComponent";

interface RevenueBarChartProps {
  data: {
    bookingSource: string;
    bookingAmount: number;
    createdAt: string;
  }[];
}

const RevenueBarChartBATM: React.FC<RevenueBarChartProps> = ({ data }) => {
  // Calculate the start and end dates for the current month
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  // Create a dictionary to aggregate booking amounts for each source within the current month
  const aggregateData: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startDate, end: endDate })) {
      const source = item.bookingSource;
      if (aggregateData[source]) {
        aggregateData[source] += item.bookingAmount;
      } else {
        aggregateData[source] = item.bookingAmount;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
      new Set(data.map((item) => item.bookingSource)),
  );

  // Create a chartData array with all unique sources and their aggregated revenue for the current month
  const chartData = uniqueSources.map((source) => ({
    source,
    Revenue: aggregateData[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"Revenue"} />
  );
};

export default RevenueBarChartBATM;
