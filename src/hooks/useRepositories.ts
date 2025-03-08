
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";

interface Repository {
  name: string;
  description: string;
}

export const useRepositories = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["repositories"],
    queryFn: apiClient.getRepositories,
    enabled: false, // Don't fetch on mount, only when explicitly requested
  });

  const fetchRepositories = async (url?: string) => {
    // Pass the URL to the refetch function if needed
    return await refetch();
  };

  return {
    repositories: data || [],
    isLoading: isPending,
    isError,
    fetchRepositories,
    isPending,
  };
};
