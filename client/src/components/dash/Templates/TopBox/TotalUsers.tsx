import React from "react";
import ChartBox from "@/components/dash/Components/ChartBox/ChartBox";
import TailwindWrapper from "@/components/dash/Components/Wrapper/TailwindWrapper";
import {useSelector} from "react-redux";
import {selectAllUsers} from "@/lib/features/userSlice";

function TotalUsers() {
    // Use the `useSelector` hook to select user data from the Redux store
    let users = useSelector(selectAllUsers);

    // users = users.filter((item: any) => item.status === "CONFIRMED");

    // Calculate the total number of users
    function calculateTotalUsers(userData:any[]) {
        // console.log(userData.length,"userData.length");
        return userData.length;
    }

    const currentDate = new Date();

    const endOfWeek = new Date();
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(currentDate.getDate() - 6);
    const totalUsers = calculateTotalUsers(users);
    const totalUsersThisWeek = users.filter((record:any) => {
        const checkInDate = new Date(record.checkInDate);
        return checkInDate <= currentDate && checkInDate >= endOfWeek;
    });

    const chartData = [
        { name: "Sun", Users: 0 },
        { name: "Mon", Users: 0 },
        { name: "Tue", Users: 0 },
        { name: "Wed", Users: 0 },
        { name: "Thu", Users: 0 },
        { name: "Fri", Users: 0 },
        { name: "Sat", Users: 0 },
    ];

    totalUsersThisWeek.forEach((user:any) => {
        const userDate = new Date(user.updatedAt);
        const dayOfWeek = userDate.getDay(); // 0 for Sunday, 1 for Monday, and so on

        // Increment the total users count for the corresponding day in chartData
        chartData[dayOfWeek].Users++;
    });

    const TotalUsersData = {
        color: "#8884d8",
        icon: "/userIcon.svg",
        title: "Total Users",
        number: totalUsers,
        dataKey: "Users",
        percentage: totalUsersThisWeek.length,
        reactIcon: "BsCalendar2Date",
        chartData: chartData
    };

    return (
        <TailwindWrapper className={"mt-5 justify-self-center"}>
            <div className="box box2">
                <ChartBox titleOfPercentage="Last 7 days" {...TotalUsersData} />
            </div>
        </TailwindWrapper>
    );
}

export default TotalUsers;