"use client";
import { useState, useEffect } from "react";

type DeviceType = "mobile" | "tablet" | "laptop" | "tv";

const getDeviceType = (width: number): DeviceType => {
  if (width <= 767) return "mobile";
  if (width >= 768 && width <= 1024) return "tablet";
  if (width >= 1025 && width <= 1440) return "laptop";
  return "tv"; // Anything larger than 1440 is considered TV.
};

export const useScreenWidth = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>(
    getDeviceType(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceType;
};
