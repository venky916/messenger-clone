"use client";
import React from "react";

import { ClipLoader } from "react-spinners";

const LoadingModal = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50">
      <ClipLoader size={40} color="#0284c7" />
    </div>
  );
};

export default LoadingModal;
