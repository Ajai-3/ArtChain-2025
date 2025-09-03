import React, { useState } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changeEmailSchema,
  type ChangeEmailSchema,
} from "../../../schemas/emailSchema";
import { useChangeEmailMutation } from "../../../hooks/security/useChangeEmailMutation";
import { useVerifyEmailTokenMutation } from "../../../hooks/security/useVerifyEmailTokenMutation";

const ChangeEmail: React.FC = () => {
  const currentEmail =
    useSelector((state: RootState) => state.user.user?.email) || "";
  const [showEmail, setShowEmail] = useState(false);
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);

  const maskedEmail = currentEmail.replace(/(.{2}).+(@.+)/, "$1******$2");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangeEmailSchema>({
    resolver: zodResolver(changeEmailSchema(currentEmail)),
  });

  // ✅ Mutation hooks using React Query's isPending
  const { mutate: updateEmail, isPending: isUpdating } = useChangeEmailMutation(
    (msg) => {
      if (msg) console.log(msg);
    }
  );

  const { mutate: verifyToken, isPending: isVerifying } =
    useVerifyEmailTokenMutation((msg) => setTokenError(msg));

  // Submit new email
  const onSubmitEmail = handleSubmit((data) => {
    updateEmail(
      { currentEmail, newEmail: data.newEmail },
      {
        onSuccess: () => {
          reset();
          setEmailUpdated(true);
        },
      }
    );
  });

  // Submit verification token
  const onSubmitToken = () => {
    if (!token.trim()) {
      setTokenError("Token cannot be empty");
      return;
    }

    verifyToken(
      { token },
      {
        onSuccess: () => {
          setEmailUpdated(false);
          setToken("");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <p className="text-sm text-muted-foreground">
          Make sure this is a valid, active email address. You’ll need it for
          password resets and important notifications.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current email (masked) */}
        <div className="relative">
          <Input
            type="text"
            value={showEmail ? currentEmail : maskedEmail}
            readOnly
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowEmail(!showEmail)}
          >
            {showEmail ? <EyeOff /> : <Eye />}
          </span>
        </div>
        <p className="text-xs text-gray-500">Current email (read-only)</p>

        {!emailUpdated ? (
          <>
            {/* New email input */}
            <div>
              <Input
                type="email"
                placeholder="Enter new email"
                {...register("newEmail")}
              />
              {errors.newEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newEmail.message}
                </p>
              )}
            </div>

            {/* Get Token Button */}
            <Button
              variant="main"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
              onClick={onSubmitEmail}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Getting...
                </>
              ) : (
                "Get token"
              )}
            </Button>
          </>
        ) : (
          <>
            <p className="text-green-600 text-sm">
              A verification token has been sent to your current email.
            </p>

            {/* Token Input */}
            <div>
              <Input
                type="text"
                placeholder="Enter token"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setTokenError(null);
                }}
              />
              {tokenError && (
                <p className="text-red-500 text-xs mt-1">{tokenError}</p>
              )}
            </div>

            {/* Submit Token Button */}
            <Button
              variant="main"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
              onClick={onSubmitToken}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Verifying...
                </>
              ) : (
                "Submit Token"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChangeEmail;
