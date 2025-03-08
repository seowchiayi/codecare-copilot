import { apiClient } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

interface CodeAnalysisParams {
  language: string;
  code: string;
  projectId?: string;
}

export const useCodeAnalysis = (params: CodeAnalysisParams) => {
  const { language, code, projectId } = params;

  const query = useQuery({
    queryKey: ["codeAnalysis", language, code, projectId],
    queryFn: async () => {
      try {
        const response = await apiClient.submitAnalysis(language, code, projectId);
        return response.data;
      } catch (error) {
        console.error("Error during code analysis:", error);
        throw error;
      }
    },
    enabled: !!code && !!language, // Ensure code and language are provided
    refetchOnWindowFocus: false,
    retry: false,
  });

  return query;
};
