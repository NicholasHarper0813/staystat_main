import React from "react";
import "./globals.css";
import Providers from "@/app/providers";
import DefaultLayout from "@/app/defaultLayout";
import ContextProvider from "@/context/ContextProvider";
import { Inter } from "next/font/google";
import { ReduxProviders } from "@/lib/provider";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sayngo",
  description: "Store Your Internal Data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="class">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Store Your Internal Data" />
      </head>
      <Providers>
        <body
          className={`${inter.className} overflow-hidden dark:bg-[#25293c] w-full min-h-screen`}
        >
          <ReduxProviders>
            <ContextProvider>
              <DefaultLayout>{children}</DefaultLayout>
            </ContextProvider>
          </ReduxProviders>
        </body>
      </Providers>
    </html>
  );
}
