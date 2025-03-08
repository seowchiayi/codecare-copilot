
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  className?: string;
}

export function CodeEditor({ initialCode = '', className }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || 'function calculateSum(a, b) {\n  return a + b;\n}\n\n// This function has unused variables\nfunction processData(data, options) {\n  const result = [];\n  // Missing null check for data\n  for (let i = 0; i < data.length; i++) {\n    result.push(data[i] * 2);\n  }\n  return result;\n}');
  
  return (
    <div className={cn("rounded-lg border border-border overflow-hidden bg-card h-[600px] flex flex-col", className)}>
      <div className="border-b border-border bg-muted p-2 flex items-center">
        <div className="flex space-x-1.5 px-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-xs text-foreground/60">script.js</div>
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1 border-r border-border">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-card p-4 resize-none font-mono text-sm focus:outline-none"
            spellCheck={false}
          ></textarea>
        </div>
        
        <div className="w-1/2 overflow-auto">
          <Tabs defaultValue="issues">
            <div className="p-2 border-b border-border">
              <TabsList className="w-full">
                <TabsTrigger value="issues" className="flex-1">Issues (3)</TabsTrigger>
                <TabsTrigger value="fixes" className="flex-1">Suggested Fixes</TabsTrigger>
                <TabsTrigger value="tips" className="flex-1">Best Practices</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="issues" className="p-0">
              <div className="p-4 space-y-4">
                <IssueItem 
                  title="Missing null check" 
                  severity="high"
                  description="Potential null reference: 'data' is not null-checked before accessing it"
                  line={6}
                />
                
                <IssueItem 
                  title="Unused variable" 
                  severity="medium"
                  description="The parameter 'options' is declared but never used"
                  line={5}
                />
                
                <IssueItem 
                  title="Function lacks JSDoc" 
                  severity="low"
                  description="Functions should be documented with JSDoc for better code maintainability"
                  line={1}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="fixes" className="p-0">
              <div className="p-4 space-y-4">
                <FixItem
                  title="Add null check for 'data'"
                  beforeCode="for (let i = 0; i < data.length; i++) {"
                  afterCode="if (data && data.length) {\n  for (let i = 0; i < data.length; i++) {"
                  lineNumber={6}
                />
                
                <FixItem
                  title="Remove unused parameter"
                  beforeCode="function processData(data, options) {"
                  afterCode="function processData(data) {"
                  lineNumber={5}
                />
                
                <FixItem
                  title="Add JSDoc comment"
                  beforeCode="function calculateSum(a, b) {"
                  afterCode="/**\n * Calculates the sum of two numbers\n * @param {number} a - First number\n * @param {number} b - Second number\n * @returns {number} Sum of a and b\n */\nfunction calculateSum(a, b) {"
                  lineNumber={1}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="tips" className="p-0">
              <div className="p-4 space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <HelpCircle size={16} className="text-primary" />
                    Input validation best practices
                  </h3>
                  <p className="text-sm text-foreground/70 mb-3">
                    Always validate function inputs at the beginning of your function. This prevents bugs and makes your code more robust.
                  </p>
                  <pre className="bg-card p-3 text-xs rounded border border-border">
{`function processData(data) {
  // Validate input first
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  // Process data after validation
  const result = [];
  for (let i = 0; i < data.length; i++) {
    result.push(data[i] * 2);
  }
  return result;
}`}
                  </pre>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <HelpCircle size={16} className="text-primary" />
                    Use array methods for readability
                  </h3>
                  <p className="text-sm text-foreground/70 mb-3">
                    Modern JavaScript provides array methods like map() that can make your code more readable and concise.
                  </p>
                  <pre className="bg-card p-3 text-xs rounded border border-border">
{`function processData(data) {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  // Using map instead of for loop
  return data.map(item => item * 2);
}`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface IssueItemProps {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  line: number;
}

function IssueItem({ title, severity, description, line }: IssueItemProps) {
  const severityColors = {
    low: "text-blue-500 bg-blue-50",
    medium: "text-yellow-500 bg-yellow-50",
    high: "text-orange-500 bg-orange-50",
    critical: "text-red-500 bg-red-50"
  };
  
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="p-3 flex justify-between items-start">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <AlertCircle size={16} className={cn(severityColors[severity].split(' ')[0])} />
            {title}
          </h3>
          <p className="text-sm text-foreground/70 mt-1">{description}</p>
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-muted text-foreground/60">
          Line {line}
        </div>
      </div>
      <div className="border-t border-border bg-muted/50 p-2 flex justify-end">
        <Button variant="outline" size="sm" className="mr-2">
          Ignore
        </Button>
        <Button size="sm">
          Fix Issue
        </Button>
      </div>
    </div>
  );
}

interface FixItemProps {
  title: string;
  beforeCode: string;
  afterCode: string;
  lineNumber: number;
}

function FixItem({ title, beforeCode, afterCode, lineNumber }: FixItemProps) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="p-3">
        <h3 className="font-medium flex items-center gap-2 mb-2">
          <CheckCircle size={16} className="text-green-500" />
          {title}
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground/60 ml-auto">
            Line {lineNumber}
          </span>
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <div className="text-xs text-foreground/60 mb-1">Current code:</div>
            <pre className="bg-muted p-2 text-xs rounded overflow-x-auto">{beforeCode}</pre>
          </div>
          <div className="flex items-center">
            <ArrowRight size={16} className="text-foreground/30 mx-1" />
            <div className="flex-1">
              <div className="text-xs text-foreground/60 mb-1">Suggested code:</div>
              <pre className="bg-muted p-2 text-xs rounded overflow-x-auto">{afterCode}</pre>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-muted/50 p-2 flex justify-end">
        <Button variant="outline" size="sm" className="mr-2">
          Ignore
        </Button>
        <Button size="sm">
          Apply Fix
        </Button>
      </div>
    </div>
  );
}
