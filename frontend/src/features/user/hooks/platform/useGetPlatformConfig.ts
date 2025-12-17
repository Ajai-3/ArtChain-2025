import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { useDispatch } from "react-redux";
import { setPlatformConfig } from "../../../../redux/slices/platformSlice";
import { useEffect } from "react";

interface PlatformConfig {
    auctionCommissionPercentage: number;
    artSaleCommissionPercentage: number;
    commissionArtPercentage: number;
    welcomeBonus: number;
    referralBonus: number;
    artCoinRate: number;
}

export const useGetPlatformConfig = () => {
    const dispatch = useDispatch();
    
    const query = useQuery({
        queryKey: ['platformConfig'],
        queryFn: async () => {
             const response = await apiClient.get<{ message: string; data: PlatformConfig }>("/api/v1/art/platform-config");
            return response.data.data;
        },
        staleTime: 1000 * 60 * 60, 
        retry: 2 
    });

    useEffect(() => {
        if (query.data) {
           dispatch(setPlatformConfig(query.data));
        }
    }, [query.data, dispatch]);

    return query;
}
