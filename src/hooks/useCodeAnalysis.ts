
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient, AnalysisRequest, AnalysisResponse } from '@/services/api';
import { toast } from 'sonner';

export function useCodeAnalysis() {
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  
  // Submit code for analysis
  const submitMutation = useMutation({
    mutationFn: async (request: AnalysisRequest) => {
      // For demo purposes, we're using the mock function
      // In production, you would use: await apiClient.submitAnalysis(request);
      const mockResponse = await apiClient.getMockAnalysis(request.code);
      return mockResponse;
    },
    onSuccess: (data) => {
      toast.success('Code analysis complete');
      setCurrentAnalysisId(data.id);
    },
    onError: (error: any) => {
      toast.error(`Analysis failed: ${error.message || 'Unknown error'}`);
    }
  });
  
  // Get analysis results
  const analysisQuery = useQuery({
    queryKey: ['analysis', currentAnalysisId],
    queryFn: async () => {
      if (!currentAnalysisId) {
        throw new Error('No analysis ID provided');
      }
      
      // In production, you would use:
      // return await apiClient.getAnalysisResults(currentAnalysisId);
      
      // For demo, we'll return the cached result from the mutation
      return submitMutation.data as AnalysisResponse;
    },
    enabled: !!currentAnalysisId && submitMutation.isSuccess,
    refetchInterval: (data) => {
      // If the analysis is still processing, poll every 3 seconds
      return data?.status === 'processing' || data?.status === 'pending' ? 3000 : false;
    }
  });
  
  // Analyze code function
  const analyzeCode = async (code: string, language: string = 'javascript') => {
    submitMutation.mutate({ code, language });
  };
  
  return {
    analyzeCode,
    isAnalyzing: submitMutation.isPending,
    analysis: analysisQuery.data,
    isLoading: analysisQuery.isLoading || submitMutation.isPending,
    error: analysisQuery.error || submitMutation.error
  };
}
