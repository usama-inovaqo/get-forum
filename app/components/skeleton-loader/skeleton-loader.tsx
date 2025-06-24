import React from "react";

interface SkeletonLoaderProps {
  boxes: number;
}

export function SkeletonLoader({ boxes }: SkeletonLoaderProps) {
  return (
    <div className="flex flex-col rounded-lg gap-4 p-2 sm:p-4">
      {[...Array(boxes)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 w-full h-16 rounded-lg animate-pulse animate-pulse-fast"
        ></div>
      ))}
    </div>
  );
}
