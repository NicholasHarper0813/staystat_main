import React from "react";
import { Bars, InfinitySpin } from "react-loader-spinner";

type Props = {
  color?: string;
};

const LoadingSpinner = ({color}: Props) => {
  return (
    <div className="flex items-center justify-center m-auto">
        <InfinitySpin 
  width='200'
  color={color ?? "#4fa94d"}
/>
    </div>
  );
};

export default LoadingSpinner;
