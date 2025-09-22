import React from "react";
import { Toaster } from "react-hot-toast";

const CustomToaster: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className:
          "rounded-lg text-sm border shadow-lg " +
          "bg-zinc-100 text-zinc-900 border-zinc-200 " +
          "dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700",
        success: {
          iconTheme: {
            primary: "#10b981", // green-500
            secondary: "#064e3b", // dark green
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // red-500
            secondary: "#7f1d1d", // dark red
          },
        },
      }}
    />
  );
};

export default CustomToaster;
