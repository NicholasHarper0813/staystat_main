import { useEffect, useState } from "react";

const useOrigin = (): string => {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  return origin;
};

export default useOrigin;
