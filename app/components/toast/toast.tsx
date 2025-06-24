import React, { useEffect, useState, ReactNode } from "react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

type ToastProps = {
  message: ReactNode;
  duration?: number; // in milliseconds
};

export default function Toast({ message, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gray-300 text-gray-900 rounded-lg p-1 flex justify-between items-center gap-2">
      <div className="flex items-center justify-center text-sm font-medium px-2">
        {message}
      </div>
      <button onClick={() => setIsVisible(false)}>
        <XMarkIcon className="w-6 h-6 rounded-lg p-1 hover:bg-gray-800 hover:text-white transition-all duration-100" />
      </button>
    </div>
  );
}
