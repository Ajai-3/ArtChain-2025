    import { useMutation } from "@tanstack/react-query";
    import apiClient from "../../../../api/axios";
    import toast from "react-hot-toast";
    import type { CreatePostInput } from "../../../../types/art/CreatePostInput";



    export const useCreatePostMutation = () => {
    return useMutation({
        mutationFn: (data: CreatePostInput) =>
            apiClient.post("/api/v1/artposts", data),
        onSuccess: (res: any) => {
            console.log(res.data)
        toast.success("Post created successfully!");
        },
        onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to create post!");
        },
    });
    };
