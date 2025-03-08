
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { useRepositories } from '@/hooks/useRepositories';
import { useCodeAnalysis } from '@/hooks/useCodeAnalysis';
import { toast } from "@/components/ui/use-toast"

export function RepositoryAnalysis() {
  const [repoUrl, setRepoUrl] = useState('');
  const { repositories, fetchRepositories, isPending: isRepoPending } = useRepositories();
  const { analyzeCode, isLoading: isAnalysisLoading } = useCodeAnalysis({
    language: 'python',
    code: '',
  });

  const handleAnalyzeRepository = async (repo: string) => {
    try {
      await analyzeCode(repo);
      toast({
        title: "Analysis Started",
        description: "Your repository is being analyzed. Please wait for the results.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to start analysis",
        description: "There was an error starting the analysis. Please try again.",
      });
    }
  };

  const handleFetchRepositories = async () => {
    try {
      await fetchRepositories(repoUrl);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch repositories",
        description: "There was an error fetching the repositories. Please try again.",
      });
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Repository</CardTitle>
          <CardDescription>Enter a GitHub repository URL to analyze its code quality.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex gap-2">
            <Input 
              type="url" 
              placeholder="https://github.com/owner/repository" 
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <Button onClick={handleFetchRepositories} disabled={isRepoPending}>
              {isRepoPending ? "Loading..." : "Fetch Repositories"}
            </Button>
          </div>
          
          {repositories && repositories.length > 0 ? (
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repositories.map((repo) => (
                    <TableRow key={repo.name}>
                      <TableCell className="font-medium">{repo.name}</TableCell>
                      <TableCell>{repo.description}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleAnalyzeRepository(repo.name)}
                          disabled={isAnalysisLoading}
                        >
                          {isAnalysisLoading ? "Analyzing..." : "Analyze"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No repositories fetched yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
