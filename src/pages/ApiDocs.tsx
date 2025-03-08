
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ApiDocs = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container px-4 md:px-6 pt-8">
          <div className="flex flex-col gap-4 mb-8">
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-foreground/60">Integrate with our code quality analysis API</p>
          </div>
          
          <Tabs defaultValue="rest" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="rest">REST API</TabsTrigger>
              <TabsTrigger value="sdk">SDK</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rest" className="mt-6 space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Authentication</CardTitle>
                    <Badge>POST</Badge>
                  </div>
                  <CardDescription>How to authenticate with the API</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`POST /api/auth/token
Content-Type: application/json

{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Submit Code</CardTitle>
                    <Badge>POST</Badge>
                  </div>
                  <CardDescription>Submit code for analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`POST /api/analysis/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "python",
  "code": "your code here",
  "project_id": "optional_project_id"
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Get Analysis Results</CardTitle>
                    <Badge>GET</Badge>
                  </div>
                  <CardDescription>Retrieve analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`GET /api/analysis/results/{analysis_id}
Authorization: Bearer <token>`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sdk" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Python SDK</CardTitle>
                  <CardDescription>Easy integration with Python applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`pip install codequalitycopilot

# Usage
from codequalitycopilot import Client

client = Client(api_key="your_api_key")
results = client.analyze(code="def example(): pass", language="python")
print(results.issues)
`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ApiDocs;
