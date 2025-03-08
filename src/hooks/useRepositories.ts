import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";

export const useRepositories = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["repositories"],
    queryFn: apiClient.getRepositories,
  });

  return {
    repositories: data || [],
    isLoading: isPending,
    isError,
  };
};
