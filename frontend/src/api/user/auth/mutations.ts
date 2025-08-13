import apiClient from "../../axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout, setUser } from "../../../redux/slices/userSlice";

// Mutation for logging in a user
export const useLoginMutation = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: { identifier: string; password: string }) =>
      apiClient.post("/api/v1/auth/login", credentials),
    onSuccess: (data: any) => {
      console.log("data", data)
      toast.success("Login successful");

        const { user, accessToken } = data;
      
      dispatch(setUser({
        user,
        accessToken
      }));

      navigate('/');
    },
    onError: (error: any) => {

      console.error("Login failed:", error);
    },
  });
};

// Mutation for logging with google
export const useGoogleAuthMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: { token: string, email: string, name: string }) =>
      apiClient.post("/api/v1/auth/google-auth", credentials),
    onSuccess: (data: any) => {
        const { user, accessToken, message } = data;

        toast.success(message);
      
      dispatch(setUser({
        user,
        accessToken
      }));

      navigate('/');
    },
    onError: (error: any) => {

      console.error("Login failed:", error);
    },
  });
}

// Mutation for signing up a new user
export const useSignupMutation = () => {
  return useMutation({
    mutationFn: (credentials: {
      name: string;
      username: string;
      email: string;
    }) => apiClient.post("/api/v1/auth/start-register", credentials),
    onSuccess: (data) => {
      console.log("Verification email sended:", data);
      toast.success("Verification email sended");
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });
};

// Mutation for verifying a new user
export const useSignupverificationMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: { token: string; password: string }) =>
      apiClient.post("/api/v1/auth/register", credentials),
    onSuccess: (data: any) => {
        const { user, accessToken } = data;

        toast.success("Verification successful");
      
      dispatch(setUser({
        user,
        accessToken
      }));

      navigate('/');
    },
    onError: (error) => {
      console.error("Verification failed:", error);
    },
  });
};

// Mutation for requesting password reset
export const useForgottPasswordMutation = () => {
  return useMutation({
    mutationFn: (credentials: { identifier: string }) =>
      apiClient.post("/api/v1/auth/forgot-password", credentials),
    onSuccess: (data) => {
      console.log("Password reset request sent:", data);
      toast.success("Password reset request sent");
    },
    onError: (error) => {
      console.error("Password reset failed:", error);
    },
  });
};

// Mutation for resetting password
export const useResetPasswordMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: { token: string; password: string }) =>
      apiClient.patch("/api/v1/auth/reset-password", credentials),
    onSuccess: (data) => {
      console.log("Password reset successful:", data);
      toast.success("Password reset successful, Login now.");
       navigate("/login")
    },
    onError: (error) => {
      console.error("Password reset failed:", error);
    },
  });
};

// Mutation for changing password
export const changePasswordMutation = () => {
  return useMutation({
    mutationFn: (credentials: {
      currentPassword: string;
      newPassword: string;
    }) => apiClient.patch("/api/v1/auth/change-password", credentials),
    onSuccess: (data) => {
      console.log("Password changed successful:", data);
      toast.success("Password changed successful");
    },
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};

// Mutation for reqest to become an artist
export const useBecomeArtistMutation = () => {
  return useMutation({
    mutationFn: (credentials: {  }) => apiClient.post("/api/v1/auth/become-artist"),
    onSuccess: (data) => {
      console.log("Artist request sent:", data);
      toast.success("Artist request sent");
    },
    onError: (error) => {
      console.error("Artist request failed:", error);
    },
  })
}

// Mutation for logging out a user
export const useLogoutMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => apiClient.post("/api/v1/auth/logout"),
    onSuccess: () => {
      dispatch(logout());
      navigate('/login');
      toast.success("Logout successful");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    },
  });
};
