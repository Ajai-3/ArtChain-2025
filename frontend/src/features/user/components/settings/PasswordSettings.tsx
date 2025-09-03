import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import ChangePassword from "./passwordsecurity/ChangePassword";
import ChangeEmail from "./passwordsecurity/ChangeEmail";
import DeactivateAccount from "./passwordsecurity/DeactivateAccount";

const PasswordSettings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-300">Account Settings</h2>

      <Tabs defaultValue="password" className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted p-1 mb-6">
          <TabsTrigger value="password" className="rounded-lg data-[state=active]:bg-black data-[state=active]:shadow">
            Change Password
          </TabsTrigger>
          <TabsTrigger value="email" className="rounded-lg data-[state=active]:bg-black data-[state=active]:shadow">
            Change Email
          </TabsTrigger>
          <TabsTrigger value="deactivate" className="rounded-lg data-[state=active]:bg-black data-[state=active]:shadow">
            Deactivate
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="password"><ChangePassword /></TabsContent>
        <TabsContent value="email"><ChangeEmail /></TabsContent>
        <TabsContent value="deactivate"><DeactivateAccount /></TabsContent>
      </Tabs>
    </div>
  );
};

export default PasswordSettings;
