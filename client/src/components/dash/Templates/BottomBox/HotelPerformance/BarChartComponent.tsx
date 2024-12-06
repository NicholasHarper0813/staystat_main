import React, { useContext } from 'react';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import Context from '@/context/Context';

function BarChartComponent(props: any) {
    const { isDarkTheme } = useContext(Context);
    const customTooltipStyle = {
        backgroundColor: isDarkTheme ? '#000' : '#fff',
        border: isDarkTheme ? '1px solid #fff' : '1px solid #000',
        color: isDarkTheme ? '#fff' : '#000',
        fontSize: '15px',
        borderRadius: '10px',
    };

    const yAxisTextStyle = {
        fill: isDarkTheme ? '#fff' : '#000',
        fontSize: '10px',
    };
    const xAxisTextStyle = {
        fill: isDarkTheme ? '#fff' : '#000',
        fontSize: '15px',
    };



    const length = props.chartData.map((item: any) => item.source).length;

    let chartHeight = 900;

    const ratio = 900 / 17;

    chartHeight = Math.floor(length * ratio);

    const minHeight = 200;
    const maxHeight = 3000;

    chartHeight = Math.max(minHeight, Math.min(maxHeight, chartHeight));


    return (
        <div style={{ height: '400px', overflow: 'auto' }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <ComposedChart data={props.chartData} layout="vertical">
                    <YAxis interval={0} dataKey="source" textAnchor="end" type="category" tick={yAxisTextStyle} />
                    <XAxis type="number" tick={xAxisTextStyle} />
                    <Tooltip contentStyle={customTooltipStyle} />
                    <Legend />
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <Bar
                        dataKey={props.type}
                        fill="url(#colorGradient)"
                        stroke="#006ef5"
                        strokeWidth={0.5}
                        barSize={20}
                        radius={[0, 5, 5, 0]}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BarChartComponent;
