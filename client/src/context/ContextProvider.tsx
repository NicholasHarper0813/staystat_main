"use client";
import React, { useState } from "react";
import FormContext, { ContextDispatch, ContextState } from "./Context";

export interface InfoData {
  softCap: number;
}

interface FormProviderProps {
  children: React.ReactNode;
}

const ContextProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [infoData, setInfoData] = useState<InfoData>({
    softCap: 0,
  });

  const [isDarkTheme, setIsDarkTheme] = useState<Boolean>(false);
  const [date, setDate] = React.useState<any>();
  const [isGrid, setIsGrid] = useState<Boolean>(true);

  const contextState: ContextState = {
    infoData,
    isDarkTheme,
    date,
    isGrid,
  };

  const contextDispatch: ContextDispatch = {
    setInfoData,
    setIsDarkTheme,
    setDate,
    setIsGrid,
  };

  return (
    <FormContext.Provider value={{ ...contextState, ...contextDispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export default ContextProvider;
