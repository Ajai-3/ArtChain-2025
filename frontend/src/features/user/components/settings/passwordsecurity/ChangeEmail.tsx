import React from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";

const ChangeEmail: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <p className="text-sm text-muted-foreground">
          Make sure this is a valid, active email address. You’ll need it for password resets and important notifications.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="email" placeholder="New Email Address" />
        <p className="text-xs text-gray-500">
          A confirmation link will be sent to your new email.
        </p>
        <Button variant={"main"} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
          Update Email
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChangeEmail;
