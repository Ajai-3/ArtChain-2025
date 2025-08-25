import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useResetPasswordMutation } from "../../hooks/auth/useResetPasswordMutation";
import {
  passwordSchema,
  type PasswordFormInput,
} from "../../schemas/authSchemas";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("token");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { token: urlToken || "" },
  });

  const { mutate: resetPasswordMutation, isPending } =
    useResetPasswordMutation();

  const onSubmit = (data: PasswordFormInput) => {
    if (!data.token) {
      console.error("No reset token found");
      return;
    }

    resetPasswordMutation(
      {
        token: data.token,
        password: data.password,
      },
      {
        onError: (error) => {
          const errorMessage =
            error.message === "Invalid or expired reset token"
              ? "The password reset link is invalid or has expired. Please request a new one."
              : error.message;
          setApiError(errorMessage);
        },
      }
    );
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background text-foreground px-4 py-6">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-md bg-card p-6 sm:p-8 rounded-2xl shadow-xl border dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold">Create New Password</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Please set a new password for your account
          </p>
          {apiError && <p className="text-red-600 text-sm">{apiError}</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          {/* Hidden token input */}
          <input type="hidden" {...register("token")} />

          <div>
            <div className="relative">
              <Input
                variant="green-focus"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pr-10"
                {...register("password")}
              />
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Input
                variant="green-focus"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="pr-10"
                {...register("confirmPassword")}
              />
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            variant="main"
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Resetting password..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
