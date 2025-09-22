import React from "react";
import { Loader } from "lucide-react";

interface LoaderProps {
  size?: number;
  className?: string;
}

const CustomLoader: React.FC<LoaderProps> = ({ size = 20, className = "" }) => {
  return (
    <Loader
      className={`animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default CustomLoader;
