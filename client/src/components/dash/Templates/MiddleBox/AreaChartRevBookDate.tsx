import React, {useContext} from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    format,
    subDays,
    eachDayOfInterval,
    endOfDay,
    startOfDay,
} from "date-fns";
import Context from "@/context/Context";

interface DataPoint {
    createdAt: string;
    advanceAmount: number;
}

interface RevenueAreaChartProps {
    data: DataPoint[];
}

const generateYearlyDateData = () => {
    const startDate = startOfDay(new Date());
    const endDate = endOfDay(subDays(startDate, 30));

    const dateInterval = eachDayOfInterval({
        start: endDate,
        end: startDate,
    });

    return dateInterval.map((date) => format(date, "MMM dd"));
};

const RevenueAreaChart: React.FC<RevenueAreaChartProps> = ({data}) => {
    const {isDarkTheme} = useContext(Context);
    const groupedData: Record<string, number> = data.reduce((acc: Record<string, number>, item) => {
        const formattedDate = format(new Date(item.createdAt), "MMM dd");
        acc[formattedDate] = (acc[formattedDate] || 0) + item.advanceAmount;
        return acc;
    }, {});

    const yearlyDateData = generateYearlyDateData();

    const chartData = yearlyDateData.map((date) => ({
        date,
        Revenue: groupedData[date] || 0,
    }));
    const customTooltipStyle = {
        backgroundColor: isDarkTheme ? '#000' : '#fff',
        border: isDarkTheme ? '1px solid #fff' : '1px solid #000',
        color: isDarkTheme ? '#fff' : '#000',
        fontSize: '15px',
        borderRadius: '10px',
    };
    const yAxisTextStyle = {
        fill: isDarkTheme ? '#fff' : '#000',
        fontSize: '15px',
    };

    const xAxisTextStyle = {
        fill: isDarkTheme ? '#fff' : '#000',
        fontSize: '15px',
        textAnchor: 'middle',

    };
    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date" tick={xAxisTextStyle}/>
                <YAxis tickFormatter={(tick) => `₹${tick}`} tick={yAxisTextStyle}/>
                <Tooltip
                    contentStyle={customTooltipStyle}
                    isAnimationActive={true}
                    useTranslate3d={true}
                    animationEasing={'ease-in-out'}
                />
                <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={1}
                        />
                        <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dot={true}
                    type="monotone"
                    dataKey="Revenue"
                    fill="url(#colorGradient)"
                    stroke="#006ef5"
                    strokeWidth={0.5}
                />
            </AreaChart>
        </ResponsiveContainer>

    );
};

export default RevenueAreaChart;
