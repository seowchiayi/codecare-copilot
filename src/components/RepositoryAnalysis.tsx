
import React, { useState } from 'react';
import { useRepositories } from '@/hooks/useRepositories';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IssueCard } from '@/components/CodeCard';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle, Shield, Code2 } from 'lucide-react';

export function RepositoryAnalysis() {
  const {
    repositories,
    isLoadingRepositories,
    selectedRepoId,
    setSelectedRepoId,
    submitAnalysis,
    isSubmitting,
    analysisResults,
    isLoadingAnalysis,
    isAnalysisComplete,
    refetchRepositories
  } = useRepositories();
  
  const [issueFilter, setIssueFilter] = useState('all');
  
  const handleAnalyze = () => {
    if (selectedRepoId) {
      submitAnalysis(selectedRepoId);
    }
  };
  
  const selectedRepo = repositories.find(repo => repo.id === selectedRepoId);
  
  const filteredIssues = analysisResults?.issues.filter(issue => {
    if (issueFilter === 'all') return true;
    return issue.type.toLowerCase() === issueFilter.toLowerCase();
  }) || [];
  
  const issueCounts = {
    bug: analysisResults?.issues.filter(i => i.type.toLowerCase() === 'bug').length || 0,
    vulnerability: analysisResults?.issues.filter(i => i.type.toLowerCase() === 'vulnerability').length || 0,
    code_smell: analysisResults?.issues.filter(i => i.type.toLowerCase() === 'code_smell').length || 0,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="repo-select" className="text-sm font-medium">
            Select a Python Repository
          </label>
          
          <div className="flex gap-2">
            <Select
              value={selectedRepoId || ''}
              onValueChange={setSelectedRepoId}
              disabled={isLoadingRepositories}
            >
              <SelectTrigger id="repo-select" className="w-full">
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map(repo => (
                  <SelectItem key={repo.id} value={repo.id}>
                    {repo.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchRepositories()}
              disabled={isLoadingRepositories}
            >
              <RefreshCw size={16} className={isLoadingRepositories ? "animate-spin" : ""} />
            </Button>
          </div>
          
          {selectedRepo && (
            <div className="text-sm text-foreground/70">
              {selectedRepo.description || "No description available"}
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleAnalyze}
          disabled={!selectedRepoId || isSubmitting || isLoadingAnalysis}
          className="min-w-[150px]"
        >
          {isSubmitting || isLoadingAnalysis ? (
            <>
              <Spinner className="mr-2" size="sm" />
              Analyzing...
            </>
          ) : (
            'Analyze Repository'
          )}
        </Button>
      </div>
      
      {/* Analysis Results */}
      {analysisResults && (
        <div className="mt-8 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Code Smells</p>
                  <h3 className="text-3xl font-bold mt-1">{analysisResults.metrics.code_smells}</h3>
                </div>
                <div className="h-10 w-10 rounded-md bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <Code2 size={20} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Bugs</p>
                  <h3 className="text-3xl font-bold mt-1">{analysisResults.metrics.bugs}</h3>
                </div>
                <div className="h-10 w-10 rounded-md bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle size={20} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Vulnerabilities</p>
                  <h3 className="text-3xl font-bold mt-1">{analysisResults.metrics.vulnerabilities}</h3>
                </div>
                <div className="h-10 w-10 rounded-md bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Shield size={20} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Test Coverage</p>
                  <h3 className="text-3xl font-bold mt-1">{analysisResults.metrics.coverage?.toFixed(1) || 'N/A'}%</h3>
                </div>
                <div className="h-10 w-10 rounded-md bg-green-500/10 flex items-center justify-center text-green-500">
                  <RefreshCw size={20} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Code Issues</CardTitle>
              <CardDescription>
                Issues detected by SonarPython in your repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={issueFilter} onValueChange={setIssueFilter}>
                <TabsList>
                  <TabsTrigger value="all">
                    All ({analysisResults.issues.length})
                  </TabsTrigger>
                  <TabsTrigger value="vulnerability">
                    Vulnerabilities ({issueCounts.vulnerability})
                  </TabsTrigger>
                  <TabsTrigger value="bug">
                    Bugs ({issueCounts.bug})
                  </TabsTrigger>
                  <TabsTrigger value="code_smell">
                    Code Smells ({issueCounts.code_smell})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={issueFilter} className="mt-4 space-y-4">
                  {filteredIssues.length === 0 ? (
                    <Alert>
                      <AlertTitle>No issues found</AlertTitle>
                      <AlertDescription>
                        No {issueFilter === 'all' ? '' : issueFilter} issues were detected in your repository.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    filteredIssues.map(issue => (
                      <IssueCard
                        key={issue.id}
                        title={issue.component}
                        severity={issue.severity.toLowerCase()}
                        description={issue.message}
                        code={`// ${issue.rule}\n// Line ${issue.line || 'unknown'}\n`}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* No repository selected */}
      {!selectedRepoId && !isLoadingRepositories && repositories.length > 0 && (
        <Alert className="mt-8">
          <AlertTitle>Select a repository</AlertTitle>
          <AlertDescription>
            Choose a Python repository from the dropdown to analyze its code quality.
          </AlertDescription>
        </Alert>
      )}
      
      {/* No repositories available */}
      {!isLoadingRepositories && repositories.length === 0 && (
        <Alert className="mt-8">
          <AlertTitle>No Python repositories found</AlertTitle>
          <AlertDescription>
            No Python repositories were found in your GitHub account. Make sure you have at least one Python repository and that you've granted the necessary permissions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
