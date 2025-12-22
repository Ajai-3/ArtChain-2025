import React, { type ReactNode } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../components/ui/tabs";
import { Button } from "../../../../components/ui/button";

interface HorizontalTabsProps {
  dashboardContent: ReactNode;
  transactionsContent: ReactNode;
  withdrawalsContent: ReactNode;
  aboutContent: ReactNode;
  referralContent: ReactNode;
}

const HorizontalTabs: React.FC<HorizontalTabsProps> = ({
  dashboardContent,
  transactionsContent,
  withdrawalsContent,
  aboutContent,
  referralContent,
}) => {
  return (
    <Tabs defaultValue="dashboard" className="">
      {/* Tabs + Buttons */}
      <div className="flex justify-between items-center mb-3">
        {" "}
        {/* Add padding-x */}
        <TabsList className="flex gap-2 bg-transparent justify-start w-auto p-0">
          {" "}
          {/* Add gap between tabs and standardize style */}
          <TabsTrigger
            value="dashboard"
            className="px-6 py-1.5 rounded-full border border-gray-200 dark:border-zinc-800 data-[state=active]:bg-main-color data-[state=active]:text-white data-[state=active]:border-main-color transition-all"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
             className="px-6 py-1.5 rounded-full border border-gray-200 dark:border-zinc-800 data-[state=active]:bg-main-color data-[state=active]:text-white data-[state=active]:border-main-color transition-all"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="withdrawals"
             className="px-6 py-1.5 rounded-full border border-gray-200 dark:border-zinc-800 data-[state=active]:bg-main-color data-[state=active]:text-white data-[state=active]:border-main-color transition-all"
          >
            Withdrawals
          </TabsTrigger>
           <TabsTrigger
             value="referral"
             className="px-6 py-1.5 rounded-full border border-gray-200 dark:border-zinc-800 data-[state=active]:bg-main-color data-[state=active]:text-white data-[state=active]:border-main-color transition-all"
          >
             Refer & Earn
          </TabsTrigger>
          <TabsTrigger
             value="about"
             className="px-6 py-1.5 rounded-full border border-gray-200 dark:border-zinc-800 data-[state=active]:bg-main-color data-[state=active]:text-white data-[state=active]:border-main-color transition-all"
          >
             About
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab content */}
      <div className="w-full">
        {" "}
        <TabsContent value="dashboard">
          <div className="overflow-x-auto">
            <div className="min-w-full">{dashboardContent}</div>
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <div className="overflow-x-auto">
            <div className="min-w-full">{transactionsContent}</div>
          </div>
        </TabsContent>
        <TabsContent value="withdrawals">
          <div className="overflow-x-auto">
            <div className="min-w-full">{withdrawalsContent}</div>
          </div>
        </TabsContent>
         <TabsContent value="referral">
            <div className="min-w-full">{referralContent}</div>
        </TabsContent>
        <TabsContent value="about">
            <div className="min-w-full">{aboutContent}</div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default HorizontalTabs;
