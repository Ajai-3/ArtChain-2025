import React from "react";
import { Toaster } from "react-hot-toast";

const CustomToaster: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1f2937", // gray-800
          color: "#f9fafb",     // gray-50
          fontSize: "14px",
          borderRadius: "8px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",  // green-500
            secondary: "#d1fae5", // green-100
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",  // red-500
            secondary: "#fee2e2", // red-100
          },
        },
      }}
    />
  );
};

export default CustomToaster;
