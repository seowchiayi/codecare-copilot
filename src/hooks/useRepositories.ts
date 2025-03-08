
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, Repository, AnalysisResponse } from '@/services/api';

/**
 * Hook to fetch and analyze GitHub repositories
 */
export function useRepositories() {
  const queryClient = useQueryClient();
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  
  // Fetch repositories
  const repositories = useQuery({
    queryKey: ['repositories'],
    queryFn: async () => {
      try {
        return await apiClient.getRepositories();
      } catch (error) {
        toast.error('Failed to fetch repositories');
        throw error;
      }
    },
    enabled: !!apiClient.getToken(),
  });
  
  // Submit repository for analysis
  const submitAnalysis = useMutation({
    mutationFn: async (repoId: string) => {
      if (!repoId) {
        throw new Error('No repository selected');
      }
      
      try {
        const result = await apiClient.submitRepositoryAnalysis({
          repository_id: repoId
        });
        
        setAnalysisId(result.analysisId);
        setSelectedRepoId(repoId);
        return result;
      } catch (error) {
        toast.error('Failed to submit repository for analysis');
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Repository submitted for analysis');
      
      // Start polling for results
      if (analysisId) {
        queryClient.invalidateQueries({ 
          queryKey: ['analysis-results', analysisId]
        });
      }
    }
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
    enabled: !!analysisId,
    refetchInterval: (data) => {
      // Poll every 5 seconds until analysis is complete
      return data?.status === 'completed' ? false : 5000;
    }
  });
  
  return {
    repositories: repositories.data || [],
    isLoadingRepositories: repositories.isLoading,
    
    selectedRepoId,
    setSelectedRepoId,
    
    submitAnalysis: submitAnalysis.mutate,
    isSubmitting: submitAnalysis.isPending,
    
    analysisId,
    analysisResults: analysis.data,
    isLoadingAnalysis: analysis.isLoading,
    isAnalysisComplete: analysis.data?.status === 'completed',
    
    refetchRepositories: repositories.refetch
  };
}
