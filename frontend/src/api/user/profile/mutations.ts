import apiClient from "../../axios";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../../redux/slices/userSlice";

export const useUpdateProfileMutation = () => {
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: (credentials: { 
            name?: string;
            username?: string;
            bio?: string;
            country?: string;
            profileImage?: string;
            bannerImage?: string;
            backgroundImage?: string;
        }) => apiClient.patch("/api/v1/users/profile", credentials),
        onSuccess: (data: any) => {
            console.log("Profile updated successfully:", data);
            dispatch(updateProfile(data));
        },
        onError: (error) => {
            console.error("Profile update failed:", error);
        },
    });
};