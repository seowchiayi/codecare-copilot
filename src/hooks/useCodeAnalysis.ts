
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
        const response = await apiClient.analyzeCode(language, code, projectId);
        return response;
      } catch (error) {
        console.error("Error during code analysis:", error);
        throw error;
      }
    },
    enabled: false, // Don't fetch on mount, only when explicitly requested
    refetchOnWindowFocus: false,
    retry: false,
  });

  const analyzeCode = async (repoName?: string) => {
    return await query.refetch();
  };

  return {
    ...query,
    analyzeCode,
  };
};
