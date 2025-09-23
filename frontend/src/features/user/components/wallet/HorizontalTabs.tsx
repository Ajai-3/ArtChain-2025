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
}

const HorizontalTabs: React.FC<HorizontalTabsProps> = ({
  dashboardContent,
  transactionsContent,
}) => {
  return (
    <Tabs defaultValue="dashboard" className="">
      {/* Tabs + Buttons */}
      <div className="flex justify-between items-center mb-4 px-2">
        {" "}
        {/* Add padding-x */}
        <TabsList className="flex-1 gap-2">
          {" "}
          {/* Add gap between tabs */}
          <TabsTrigger
            value="dashboard"
            className="flex-1 text-center rounded-md border"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="flex-1 text-center rounded-md border"
          >
            Transactions
          </TabsTrigger>
        </TabsList>
        <div className="flex gap-2 ml-4">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-sm px-4 py-2 rounded font-semibold">
            Premium
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded font-semibold">
            Export
          </Button>
        </div>
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
      </div>
    </Tabs>
  );
};

export default HorizontalTabs;
