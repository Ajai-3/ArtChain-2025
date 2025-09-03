import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../../../schemas/changePasswordSchema";
import { useChangePasswordMutation } from "../../../hooks/security/useChangePasswordMutation";

const ChangePassword: React.FC = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      logout: false,
    },
  });

  const mutation = useChangePasswordMutation(setFormError);
  const onSubmit = (data: ChangePasswordFormData) => {
    setFormError(null);    
    reset();                
    mutation.mutate(data); 
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your password must be at least{" "}
          <span className="font-medium">8 characters</span> and include numbers, letters, and symbols.
        </p>
        <p className="text-xs text-gray-400 mt-1">Last updated: 15/04/2024</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Global API Error */}
          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          {/* Current Password */}
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input type={showCurrent ? "text" : "password"} placeholder="Current Password" {...field} />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff /> : <Eye />}
                </span>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                )}
              </div>
            )}
          />

          {/* New Password */}
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input type={showNew ? "text" : "password"} placeholder="New Password" {...field} />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff /> : <Eye />}
                </span>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                )}
              </div>
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input type={showConfirm ? "text" : "password"} placeholder="Confirm New Password" {...field} />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff /> : <Eye />}
                </span>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}
          />

          {/* Logout Checkbox */}
          <div className="flex items-center space-x-2">
            <Controller
              name="logout"
              control={control}
              render={({ field }) => (
                <Checkbox id="logout" checked={!!field.value} onCheckedChange={field.onChange} />
              )}
            />
            <label htmlFor="logout" className="text-sm text-gray-400 cursor-pointer">
              Log out of other devices. Choose this if someone else used your account.
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="main"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
