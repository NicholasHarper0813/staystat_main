"use client";
import React, { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { SnackbarProvider } from "notistack";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{children}</>;
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SnackbarProvider maxSnack={3}>
        <NextUIProvider>{children}</NextUIProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Providers;
