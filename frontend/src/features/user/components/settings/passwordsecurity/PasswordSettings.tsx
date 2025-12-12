import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../components/ui/tabs";
import ChangePassword from "./ChangePassword";
import ChangeEmail from "./ChangeEmail";
import DeactivateAccount from "./DeactivateAccount";

const PasswordSettings: React.FC = () => {
  return (
     <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Password & Security
      </h1>
      <Tabs defaultValue="password" className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted p-1 mb-6">
          <TabsTrigger
            value="password"
            className="rounded-lg dark:data-[state=active]:bg-black data-[state=active]:bg-zinc-400"
          >
            Change Password
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="rounded-lg dark:data-[state=active]:bg-black data-[state=active]:bg-zinc-400"
          >
            Change Email
          </TabsTrigger>
          <TabsTrigger
            value="deactivate"
            className="rounded-lg dark:data-[state=active]:bg-black data-[state=active]:bg-zinc-400"
          >
            Deactivate
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="password">
          <ChangePassword />
        </TabsContent>
        <TabsContent value="email">
          <ChangeEmail />
        </TabsContent>
        <TabsContent value="deactivate">
          <DeactivateAccount />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PasswordSettings;
