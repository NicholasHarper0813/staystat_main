"use client";
import { useEffect, useState } from "react";

// Define a type for the window dimension
type WindowDimension = {
  width: number;
  height: number;
};

// Define a custom hook that returns the window dimension
const useWindowDimension = (): WindowDimension => {
  // Initialize the state with undefined values
  const [windowDimension, setWindowDimension] = useState<WindowDimension>({
    width: 800,
    height: 900,
  });

  // Define a handler function that updates the state with the current window dimension
  const handleResize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Use the useEffect hook to add and remove the event listener on window resize
  useEffect(() => {
    // Call the handler function once to set the initial state
    handleResize();
    // Add the event listener on window resize
    window.addEventListener("resize", handleResize);
    // Return a cleanup function that removes the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Pass an empty dependency array to run the effect only once

  // Return the window dimension from the state
  return windowDimension;
};

export default useWindowDimension;
