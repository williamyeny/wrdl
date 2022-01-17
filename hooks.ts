import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    function onWindowResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  return width <= 768;
};
