"use client";

interface AvatarProps {
  name?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, color = "#6366f1", size = "md", className = "" }: AvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
}
