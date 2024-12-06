"use client";
import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link";
import { FaUserClock } from "react-icons/fa";
import { useState } from "react";
import ViewDashData from "@/components/dash/Components/Table/ViewDashData";

type Props = {
  color: string;
  icon?: string;
  title: string;
  dataKey: string;
  number: number | string;
  percentage: number;
  chartData: object[];
  reactIcon?: string;
  titleOfPercentage: string;
};

const ChartBox = (props: Props) => {
  const [modal, setModal] = useState(false);
  const getReactIcon = (iconName: string) => {
    switch (iconName) {
      case "BsCalendar2Date":
        return <FaUserClock className="text-lg" />;
      default:
        return null;
    }
  };

  return (
      <div className="chartBox">
        {
          modal && (
            <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
            <ViewDashData variable={props.title} onClose={(value) => setModal(value)} />
          </div>
          )
        }
        <div className="boxInfo">
          <div className="title">
            {props.reactIcon && getReactIcon(props.reactIcon)}
            {props.icon && <img src={props.icon} alt="" />}
            <span>{props.title}</span>
          </div>
          <div className="flex flex-col justify-center items-start">
          <h1>{props.number}</h1>
          <button onClick={() => setModal(!modal)} style={{ color: props.color }}>
            View all
          </button>
          </div>
        </div>
        <div className="chartInfo">
          <div className="chart">
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={props.chartData}>
                <Tooltip
                    contentStyle={{ background: "transparent", border: "none" }}
                    labelStyle={{ display: "none" }}
                    position={{ x: 10, y: -40 }}
                    formatter={(dataKey) => {
                      // Display the exact date as a tooltip
                      return dataKey;
                      // return 1;
                    }}
                />
                <Line
                    type="monotone"
                    // dataKey={props.dataKey}
                    dataKey={props.dataKey}
                    stroke={props.color}
                    strokeWidth={2}
                    dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="texts">
          <span
              className="percentage"
              style={{ color: props.percentage < 0 ? "tomato" : "limegreen" }}
          >
            {props.percentage}
          </span>
            <span className="duration">{props.titleOfPercentage}</span>
          </div>
        </div>
      </div>
  );
};

export default ChartBox;