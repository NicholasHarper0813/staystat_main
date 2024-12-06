import React from "react";

import {isWithinInterval, startOfWeek, endOfWeek} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/UserPerformance/BarChartComponent";

interface BookingCountBarChartProps {
    data: {
        userName: string;
        createdAt: string;
    }[];
}

const BookingCountBarChartBCTW: React.FC<BookingCountBarChartProps> = ({
                                                                           data,
                                                                       }) => {
    // Calculate the start and end dates for the current week
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);

    // Create a dictionary to count the number of bookings for each source within the week
    const bookingCounts: { [key: string]: number } = {};

    data.forEach((item) => {
        const itemDate = new Date(item.createdAt);
        if (isWithinInterval(itemDate, {start: startDate, end: endDate})) {
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

    // Create a chartData array with all unique sources and their booking counts for the week
    const chartData = uniqueSources.map((source) => ({
        source,
        BookingCount: bookingCounts[source] || 0,
    }));

    return (
        <>
            <BarChartComponent chartData={chartData} type={"BookingCount"}/>
        </>
    );
};

export default BookingCountBarChartBCTW;
