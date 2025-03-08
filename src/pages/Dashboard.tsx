import React from 'react';
import { Navbar } from '@/components/Navbar';
import { MetricsGrid } from '@/components/MetricCard';
import { IssueCard } from '@/components/CodeCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RepositoryAnalysis } from '@/components/RepositoryAnalysis';
import { useScrollReveal } from '@/lib/animations';
import { FileSearch, RefreshCw, FileDown, Filter, Github } from 'lucide-react';
import { apiClient } from '@/services/api';

const Dashboard = () => {
  const [statsRef, isStatsVisible] = useScrollReveal();
  const [repoRef, isRepoVisible] = useScrollReveal();
  
  const handleConnectGitHub = () => {
    const githubAuthUrl = `${apiClient.getGithubAuthUrl()}?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&client_secret=${import.meta.env.VITE_GITHUB_SECRET_KEY}`;
    window.location.href = githubAuthUrl;
  };
  
  const isAuthenticated = !!apiClient.getToken();
  
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container px-4 md:px-6 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Python Code Quality Dashboard</h1>
              <p className="text-foreground/60 mt-1">
                Analyze your Python repositories with SonarPython integration
              </p>
            </div>
            
            {/* <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <Button onClick={handleConnectGitHub} className="gap-2">
                  <Github size={16} />
                  <span>Connect GitHub</span>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="gap-2">
                  <FileDown size={16} />
                  <span>Export Report</span>
                </Button>
              )}
            </div> */}
          </div>
          
          {/* GitHub Connection Required Message */}
          {!isAuthenticated && (
            <div 
              ref={statsRef as React.RefObject<HTMLDivElement>}
              className={`bg-card rounded-xl border border-border p-6 text-center mt-8 animate-fade-up ${isStatsVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <h2 className="text-xl font-semibold mb-2">Connect Your GitHub Account</h2>
              <p className="text-foreground/70 mb-4">
                To analyze your Python repositories, please connect your GitHub account using the button above.
              </p>
              <Button onClick={handleConnectGitHub} size="lg" className="gap-2">
                <Github size={18} />
                <span>Connect with GitHub</span>
              </Button>
            </div>
          )}
          
          {/* Repository Analysis Section */}
          {isAuthenticated && (
            <div 
              ref={repoRef as React.RefObject<HTMLDivElement>}
              className={`mt-8 animate-fade-up ${isRepoVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <RepositoryAnalysis />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
