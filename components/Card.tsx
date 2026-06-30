"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm ${paddingMap[padding]} ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
