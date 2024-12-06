"use client";
import React from "react";
/* Core */
import { Provider } from "react-redux";
import {store} from "@/lib/redux/store";

/* Instruments */

export function ReduxProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
        <>{children}</>
    </Provider>
  );
}
