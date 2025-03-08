
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { MetricsGrid } from '@/components/MetricCard';
import { IssueCard } from '@/components/CodeCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useScrollReveal } from '@/lib/animations';
import { FileSearch, RefreshCw, FileDown, Filter } from 'lucide-react';

// Sample data for charts
const qualityTrendData = [
  { name: 'Jan', score: 62 },
  { name: 'Feb', score: 68 },
  { name: 'Mar', score: 73 },
  { name: 'Apr', score: 77 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 87 },
];

const issueTypeData = [
  { name: 'Bugs', count: 12 },
  { name: 'Code Smells', count: 47 },
  { name: 'Vulnerabilities', count: 2 },
  { name: 'Security', count: 8 },
  { name: 'Performance', count: 15 },
];

const Dashboard = () => {
  const [statsRef, isStatsVisible] = useScrollReveal();
  const [chartsRef, isChartsVisible] = useScrollReveal();
  const [issuesRef, isIssuesVisible] = useScrollReveal();
  
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container px-4 md:px-6 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Project Dashboard</h1>
              <p className="text-foreground/60 mt-1">Code quality overview and metrics</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown size={16} />
                <span>Export</span>
              </Button>
              <Button size="sm" className="gap-2">
                <RefreshCw size={16} />
                <span>Analyze</span>
              </Button>
            </div>
          </div>
          
          {/* Metrics Overview */}
          <div 
            ref={statsRef as React.RefObject<HTMLDivElement>}
            className={`animate-fade-up ${isStatsVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <MetricsGrid />
          </div>
          
          {/* Charts */}
          <div 
            ref={chartsRef as React.RefObject<HTMLDivElement>}
            className={`mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up ${isChartsVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ animationDelay: '0.1s' }}
          >
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Quality Score Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Issues by Type</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={issueTypeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--primary))" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Issues Section */}
          <div 
            ref={issuesRef as React.RefObject<HTMLDivElement>}
            className={`mt-8 animate-fade-up ${isIssuesVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Issues</h3>
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileSearch size={16} />
                  <span>View All</span>
                </Button>
              </div>
              
              <Tabs defaultValue="critical">
                <TabsList>
                  <TabsTrigger value="critical">Critical (2)</TabsTrigger>
                  <TabsTrigger value="high">High (5)</TabsTrigger>
                  <TabsTrigger value="medium">Medium (8)</TabsTrigger>
                  <TabsTrigger value="low">Low (12)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="critical" className="mt-4 space-y-4">
                  <IssueCard
                    title="Potential SQL Injection"
                    severity="critical"
                    description="Direct use of user input in SQL query creates a security vulnerability"
                    code="const query = `SELECT * FROM users WHERE id = ${userId}`;"
                  />
                  
                  <IssueCard
                    title="Authentication Bypass"
                    severity="critical"
                    description="Missing verification allows users to access restricted resources"
                    code="function getResource(id) {\n  // Missing authentication check\n  return db.resources.findById(id);\n}"
                  />
                </TabsContent>
                
                <TabsContent value="high" className="mt-4">
                  <div className="text-center py-12 text-foreground/60">
                    Select an issue category to view details
                  </div>
                </TabsContent>
                
                <TabsContent value="medium" className="mt-4">
                  <div className="text-center py-12 text-foreground/60">
                    Select an issue category to view details
                  </div>
                </TabsContent>
                
                <TabsContent value="low" className="mt-4">
                  <div className="text-center py-12 text-foreground/60">
                    Select an issue category to view details
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
