import React from "react";

export interface InfoData {
  softCap: number;
}

export interface ContextState {
  infoData: InfoData;
  isDarkTheme: Boolean;
  date: any;
  isGrid: Boolean;
}

export interface ContextDispatch {
  setInfoData: React.Dispatch<React.SetStateAction<InfoData>>;
  setIsDarkTheme: React.Dispatch<React.SetStateAction<Boolean>>;
  setDate: React.Dispatch<React.SetStateAction<any>>;
  setIsGrid: React.Dispatch<React.SetStateAction<Boolean>>;
}

type ContextProps = ContextState & ContextDispatch;

const defaultInfoData: InfoData = {
  softCap: 0,
};

const defaultDispatch: ContextDispatch = {
  setInfoData: () => {},
  setIsDarkTheme: () => {},
  setDate: () => {},
  setIsGrid: () => {},
};

const defaultFormContext: ContextProps = {
  ...defaultDispatch,
  infoData: defaultInfoData,
  isDarkTheme: false,
  date: new Date(),
  isGrid: true,
};

const Context = React.createContext<ContextProps>(defaultFormContext);

export default Context;
