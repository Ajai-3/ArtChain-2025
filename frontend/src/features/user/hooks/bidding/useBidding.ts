import { useState, useEffect } from "react";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useAuctions = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/art/auctions");
        setAuctions(Array.isArray(data) ? data : (data.auctions || []));
      } catch (err: any) {
        setError(err.message || "Failed to fetch auctions");
        toast.error("Failed to load auctions");
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  return { auctions, loading, error };
};

export const useAuctionById = (id: string | undefined) => {
  const [auction, setAuction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuction = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/art/auctions/${id}`);
      setAuction(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch auction");
      toast.error("Failed to load auction details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [id]);

  return { auction, loading, error, refetch: fetchAuction };
};

export const usePlaceBid = () => {
    const [loading, setLoading] = useState(false);
    
    const placeBid = async (auctionId: string, amount: number) => {
        try {
            setLoading(true);
            await apiClient.post("/art/bids", { auctionId, amount });
            toast.success("Bid placed successfully!");
            return true;
        } catch (error: any) {
             toast.error(error.response?.data?.message || "Failed to place bid");
             return false;
        } finally {
            setLoading(false);
        }
    };

    return { placeBid, loading };
}

export const useCreateAuction = () => {
  const [loading, setLoading] = useState(false);

  const createAuction = async (data: any) => {
    try {
      setLoading(true);
      await apiClient.post("/art/auctions", data);
      toast.success("Auction created successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create auction");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createAuction, loading };
};

export const useUserArts = (userId: string | undefined) => {
  const [arts, setArts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchArts = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/art/user/${userId}`);
        setArts(Array.isArray(data.data) ? data.data : (data.data?.data || [])); 
      } catch (error) {
        console.error("Failed to fetch user arts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArts();
  }, [userId]);

  return { arts, loading };
};
