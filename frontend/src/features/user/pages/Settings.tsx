import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-zinc-800/50 dark:bg-zinc-800/30 flex items-center justify-center border border-zinc-700 dark:border-zinc-700">
          <SettingsIcon className="w-12 h-12 text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-3">
        Settings
      </h1>
      
      <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md">
        Select a settings category from the sidebar to manage your account preferences and configurations.
      </p>
      
      <div className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
        Use the menu on the left to navigate through different settings
      </div>
    </div>
  );
};

export default Settings;
