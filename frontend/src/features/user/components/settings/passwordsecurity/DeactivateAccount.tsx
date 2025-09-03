import React from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";

const DeactivateAccount: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-600">Deactivate Account</CardTitle>
        <p className="text-sm text-muted-foreground">
          Deactivating your account is <span className="font-semibold">permanent</span>. 
          All your data will be lost and cannot be recovered.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-gray-500">
          Before you deactivate, you may want to download your data or change your email instead.
        </p>
        <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
          Deactivate Account
        </Button>
      </CardContent>
    </Card>
  );
};


export default DeactivateAccount;
