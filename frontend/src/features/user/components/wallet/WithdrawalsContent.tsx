import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import WithdrawalsTable from "./WithdrawalsTable";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

const WithdrawalsContent: React.FC = () => {
  const wallet = useSelector((state: RootState) => state.wallet);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-1 w-full flex flex-col min-h-[500px]">
        <Card className="dark:bg-secondary-color rounded-lg shadow-md flex-1 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl">Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <WithdrawalsTable balance={wallet.balance || 0} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WithdrawalsContent;
