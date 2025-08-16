import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { LoginSchema } from "../../schema/adminAuthSchema";
import { type LoginFormInputs } from "../../schema/adminAuthSchema";
import { useAdminLoginMutation } from "../../../../api/admin/Auth/mutations";
import { useForm } from "react-hook-form";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const { mutate: loginMutation, isPending } = useAdminLoginMutation();

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation({
      identifier: data.identifier,
      password: data.password,
    });
  };

  return (
    <div className="flex-col h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-[500px] max-w-md bg-card p-8 rounded-2xl shadow-xl border dark:border-zinc-800 dark:bg-secondary-color">
        <h1 className="text-main-color font-logo text-4xl font-bold text-center mb-8">
          Admin Login ArtChain
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <Input
              variant="green-focus"
              placeholder="Email or Username"
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-sm text-red-500 mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

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

          <Button
            variant="main"
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
