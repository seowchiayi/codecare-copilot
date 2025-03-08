
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, AnalysisResponse } from '@/services/api';

interface UseCodeAnalysisProps {
  code?: string;
  language?: string;
  projectId?: string;
  enabled?: boolean;
}

/**
 * Hook to analyze code and get quality feedback
 */
export function useCodeAnalysis({
  code = '',
  language = 'python',
  projectId,
  enabled = false
}: UseCodeAnalysisProps) {
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  
  // Submit code for analysis
  const { isPending: isSubmitting, mutateAsync: submitCode } = useQuery({
    queryKey: ['submit-analysis', code, language, projectId],
    queryFn: async () => {
      if (!code.trim()) {
        throw new Error('No code provided for analysis');
      }
      
      try {
        const result = await apiClient.submitAnalysis({
          code,
          language,
          projectId
        });
        
        setAnalysisId(result.analysisId);
        return result;
      } catch (error) {
        toast.error('Failed to submit code for analysis');
        throw error;
      }
    },
    enabled: false // Manually triggered
  });
  
  // Get analysis results
  const analysis = useQuery({
    queryKey: ['analysis-results', analysisId],
    queryFn: async () => {
      if (!analysisId) {
        throw new Error('No analysis ID available');
      }
      
      try {
        return await apiClient.getAnalysisResults(analysisId);
      } catch (error) {
        toast.error('Failed to fetch analysis results');
        throw error;
      }
    },
    enabled: !!analysisId && enabled,
  });
  
  // Combined loading state
  const isLoading = isSubmitting || analysis.isLoading;
  const isError = analysis.isError;
  
  return {
    submitCode,
    results: analysis.data,
    isLoading,
    isError,
    isSuccess: analysis.isSuccess,
    error: analysis.error
  };
}
