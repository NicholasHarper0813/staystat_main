import React, { useContext, useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import Context from '@/context/Context';

function BarChartComponent(props: any) {
    const { isDarkTheme } = useContext(Context);
    const [xAxisAngle, setXAxisAngle] = useState(0);
    const [chartWidth, setChartWidth] = useState(600); // Initial width for larger screens

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

    const updateChartSettings = () => {
        const screenWidth = window.innerWidth;
        console.log(screenWidth + 'px');
        if (screenWidth >= 1800) {
            setXAxisAngle(0); // Adjust as needed

            setChartWidth(600); // Adjust as needed
        } else if (screenWidth >= 1024 && screenWidth < 1800) {
            setXAxisAngle(-25); // Adjust as needed
            setChartWidth(600); // Adjust as needed



        } else if (screenWidth < 768) {
            setXAxisAngle(-50); // Adjust as needed
            setChartWidth(screenWidth - 20); // Adjust as needed
        } else if (screenWidth >= 768 && screenWidth < 1024) {
            setXAxisAngle(-25); // Adjust as needed
            setChartWidth(screenWidth - 100); // Adjust as needed
        } else {
            setXAxisAngle(-25); // Default angle for larger screens
            setChartWidth(600); // Default width for larger screens
        }
    };

    useEffect(() => {
        updateChartSettings();
        window.addEventListener('resize', updateChartSettings);
        return () => window.removeEventListener('resize', updateChartSettings);
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={props.chartData} width={chartWidth}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        {/* Start from the top with 100% opacity */}
                        <stop offset="0%" stopColor="#8884d8" stopOpacity={1} />
                        {/* Transition to the bottom with 0% opacity */}
                        <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="source"
                    angle={xAxisAngle}
                    textAnchor="end"
                    tick={xAxisTextStyle}
                    interval={0}
                />
                <YAxis tick={yAxisTextStyle} />
                <Tooltip
                    contentStyle={customTooltipStyle}
                    isAnimationActive={true}
                    useTranslate3d={true}
                    animationEasing={'ease-in-out'}
                />
                <Legend />
                <Bar
                    dataKey={props.type}
                    fill="url(#colorUv)"
                    stroke="#006ef5"
                    strokeWidth={0.5}
                    barSize={40}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default BarChartComponent;
