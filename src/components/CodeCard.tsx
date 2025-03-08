
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeCardProps {
  title: string;
  language: string;
  code: string;
  className?: string;
}

export function CodeCard({ title, language, code, className }: CodeCardProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden shadow-md bg-card border border-border", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{language}</div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface CodeComparisonProps {
  title: string;
  language: string;
  beforeCode: string;
  afterCode: string;
  className?: string;
}

export function CodeComparison({ title, language, beforeCode, afterCode, className }: CodeComparisonProps) {
  return (
    <div className={cn("grid md:grid-cols-2 gap-4", className)}>
      <CodeCard 
        title={`${title} - Before`} 
        language={language} 
        code={beforeCode} 
      />
      <CodeCard 
        title={`${title} - After`} 
        language={language} 
        code={afterCode} 
      />
    </div>
  );
}

export function IssueCard({ 
  title, 
  severity = "medium", 
  description, 
  code, 
  language = "typescript",
  className
}: { 
  title: string; 
  severity?: "low" | "medium" | "high" | "critical"; 
  description: string;
  code: string;
  language?: string;
  className?: string;
}) {
  const severityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800"
  };
  
  return (
    <div className={cn("rounded-lg overflow-hidden border border-border bg-card", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{title}</h3>
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", severityColors[severity])}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </span>
        </div>
        <p className="text-sm text-foreground/70">{description}</p>
      </div>
      <pre className="p-4 bg-muted/50 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
