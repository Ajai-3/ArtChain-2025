import { useState, useEffect } from "react";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

interface PlatformConfig {
  auctionCommissionPercentage: number;
  artSaleCommissionPercentage: number;
  welcomeBonus: number;
  referralBonus: number;
  artCoinRate: number;
}

export const usePlatformConfig = () => {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<any>("/api/v1/art/admin/platform-config");
      setConfig(response.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch platform config");
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (data: Partial<PlatformConfig>) => {
    setUpdating(true);
    try {
      const response = await apiClient.patch<any>("/api/v1/art/admin/platform-config", data);
      setConfig(response.data.data);
      toast.success("Platform configuration updated successfully");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update config");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return { config, loading, updating, error, updateConfig };
};
