import React from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Loader2 } from "lucide-react";

const ProfileSettings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Edit Profile
      </h1>

      {/* Error message placeholder */}
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
        {/* Server error placeholder */}
      </div>

      <form className="space-y-6">
        {/* Image section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile
            </label>
            <div className="group relative cursor-pointer block">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 w-28 h-28 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                {/* Image preview placeholder */}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            {/* Banner Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Banner
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 w-full h-28 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800"></div>
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Background
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 w-full h-28 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800"></div>
            </div>
          </div>
        </div>

        {/* Text inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <Input placeholder="Your full name" className="text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <Input placeholder="Your username" className="text-sm" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <Textarea placeholder="Tell something about yourself..." rows={3} className="text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <Input placeholder="e.g., India" className="text-sm" />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="main" className="px-4 py-1.5 text-sm">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
