import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import apiClient from "../../api/axios";
import { setUser } from "../../redux/slices/userSlice";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const initialAuthResponse = await apiClient.get("/api/v1/auth/initialize", {
          _noRetry: true,
        });

        const { accessToken, user } = initialAuthResponse.data;

        console.log(initialAuthResponse, initialAuthResponse.data)

        if (accessToken && user) {
          dispatch(setUser({ 
             accessToken, 
             user 
          }));
        }
      } catch (error) {
        console.log("No active session found or session expired.");
      } finally {
        setTimeout(() => setLoading(false), 1500); 
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-kaushan text-main-color tracking-wider mb-20 animate-pulse">
          ArtChain
        </h1>
        
        <div className="absolute bottom-12 flex flex-col items-center gap-2">
           <div className="text-xs text-muted-foreground tracking-[0.2em] font-medium text-gray-400">
             from
           </div>
           
           <div className="flex items-center gap-2 font-semibold text-foreground tracking-widest text-lg">
             Liora.ai
           </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
