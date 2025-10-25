import { useQuery } from "@tanstack/react-query";
import { getAuthTelegram } from "@/api/auth";
import type { TelegramUser } from "@/types";

interface UseUserReturn {
  user: TelegramUser | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}


const fetchUser = async (): Promise<TelegramUser | null> => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in localStorage");
  }

  const response = await getAuthTelegram(userId);
  
  if (response && !response.isError && response.data?.user) {
    console.log("User data loaded:", response.data.user);
    console.log("inviteUrl:", response.data.user.inviteUrl);
    return response.data.user;
  }
  
  if (response?.isError) {
    throw new Error(`Failed to load user data: ${response.status}`);
  }
  
  throw new Error("Failed to load user data");
};

export const useUser = (): UseUserReturn => {

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 15 * 60 * 1000,  
    gcTime: 30 * 60 * 1000, 

    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("User ID not found")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return {
    user: user || null,
    isLoading,
    error: error as Error | null,
    refetch: () => {
      refetch();
    },
  };
}; 