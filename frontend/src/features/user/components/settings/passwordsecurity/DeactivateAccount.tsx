import React, { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";

const DeactivateAccount: React.FC = () => {
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  const reasons = [
    "I get too many notifications",
    "Privacy concerns",
    "Creating a new account",
    "Other",
  ];

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length > 0 && value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleDeactivateClick = () => {
    if (!agree) return alert("You must agree to the terms.");
    if (!password || password.length < 8) return alert("Please enter a valid password to confirm.");
    
    setShowModal(true); // open modal instead of immediate deactivation
  };

  const handleConfirm = () => {
    if (!reason) return alert("Please select a reason for deactivation.");

    // Call your mutation or API here
    console.log("Deactivate with reason:", reason, "Password:", password);

    setShowModal(false);
    alert("Account deactivation requested. Your account will be deleted in 16 days if not reactivated.");
  };

  const isButtonEnabled = agree && password.length >= 8;

  return (
    <>
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600 text-xl">Deactivate Account</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Deactivating your account is <span className="font-semibold">permanent</span>. 
            All your data, posts, and profile information will be removed after <span className="font-semibold">16 days</span> from the deactivation date.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            While your account is deactivated:
            <ul className="list-disc ml-5 mt-1">
              <li>Your content will not be visible to other users.</li>
              <li>You can reactivate your account within 16 days.</li>
              <li>After 16 days, your account and all data will be <span className="font-semibold">permanently deleted</span> and cannot be recovered.</li>
            </ul>
          </p>

          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={agree} 
              onChange={() => setAgree(!agree)} 
              className="w-4 h-4 accent-red-600" 
            />
            <span className="text-sm text-gray-600">
              I understand that my account will be deactivated and data may be permanently deleted.
            </span>
          </label>

          {agree && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Please enter your password to confirm deactivation:
              </p>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
              />
              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
            </div>
          )}

          <Button
            className={`w-full sm:w-auto mt-2 text-white ${isButtonEnabled ? "bg-red-600 hover:bg-red-700" : "bg-red-600 cursor-not-allowed"}`}
            onClick={handleDeactivateClick}
            disabled={!isButtonEnabled}
          >
            Deactivate Account
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Account Deactivation</DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <p className="text-sm text-gray-400">
              Are you sure you want to deactivate your account? You can reactivate within 16 days, otherwise your account and all data will be permanently deleted.
            </p>

            <Select onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirm}>
              Confirm Deactivation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeactivateAccount;
