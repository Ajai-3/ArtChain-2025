import apiClient from "../../axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout, setUser } from "../../../redux/slices/userSlice";

interface ArtistRequestPayload {
  phone?: string;
  bio?: string;
  country?: string;
}












export const useCreateArtistRequestMutation = () => {
  return useMutation({
    mutationFn: (data: ArtistRequestPayload) =>
      apiClient.post("/api/v1/user/artist-request", data),
    onSuccess: (res) => {
      console.log("Artist request submitted:", res.data);
      toast.success("Artist request submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useLogoutMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => apiClient.post("/api/v1/auth/logout"),
    onSuccess: (res) => {
      console.log("Logout successful:", res.data);
      dispatch(logout());
      navigate("/login");
      toast.success("Logout successful");
    },
    onError: (error) => {
      toast.error("Logout failed");
    },
  });
};
