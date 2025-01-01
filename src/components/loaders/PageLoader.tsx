import React from "react";

const PageLoader = () => {
  return (
    <div className="flex justify-center items-center w-full h-full bg-white z-50">
      <div className="flex gap-2">
        <div className="w-5 h-5 rounded-full animate-pulse bg-theme-primary"></div>
        <div className="w-5 h-5 rounded-full animate-pulse bg-theme-primary"></div>
        <div className="w-5 h-5 rounded-full animate-pulse bg-theme-primary"></div>
      </div>
    </div>
  );
};

export default PageLoader;
