"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import React, { useEffect } from "react";

const MoonPay = ({
  open,
  setOpen,
  url,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  url: string | null;
}) => {
  const ref = React.useRef<HTMLIFrameElement>(null);

  const closeOverlay = () => setOpen(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-lg">
        <button
          onClick={closeOverlay}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        u
        <iframe
          src={url ?? "#"}
          title={"MoonPay"}
          className="w-full h-full rounded-lg"
          style={{ height: "calc(90vh - 4rem)" }}
        />
      </div>
    </div>
  );
};

export default MoonPay;
