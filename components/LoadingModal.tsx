"use client";

import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import React from "react";

import { ClipLoader } from "react-spinners";

const LoadingModal = () => {
  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogOverlay className="fixed inset-0 z-50 bg-white/50 " />
      <DialogContent className="fixed inset-0 z-10 flex items-center justify-center p-4 text-center max-w-sm w-full">
        <div className="transition-transform transform ease-out duration-300 scale-95 opacity-100">
          <ClipLoader size={40} color="#0284c7" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;
