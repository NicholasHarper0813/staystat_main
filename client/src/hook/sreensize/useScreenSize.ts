import React from "react";

function useScreenSize() {
  const [size, setSize] = React.useState([0, 0]);

  React.useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

export default useScreenSize;
