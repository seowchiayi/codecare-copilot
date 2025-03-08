
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { CodeEditor } from '@/components/CodeEditor';
import { Button } from '@/components/ui/button';
import { useScrollReveal } from '@/lib/animations';
import { BarChart4, RefreshCw, FileDown, Save } from 'lucide-react';

const Editor = () => {
  const [editorRef, isEditorVisible] = useScrollReveal();
  
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container px-4 md:px-6 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Code Editor</h1>
              <p className="text-foreground/60 mt-1">Get real-time quality feedback as you code</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <BarChart4 size={16} />
                <span>View Stats</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown size={16} />
                <span>Export</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw size={16} />
                <span>Analyze</span>
              </Button>
              <Button size="sm" className="gap-2">
                <Save size={16} />
                <span>Save</span>
              </Button>
            </div>
          </div>
          
          {/* Editor Component */}
          <div 
            ref={editorRef as React.RefObject<HTMLDivElement>}
            className={`animate-fade-up ${isEditorVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <CodeEditor />
          </div>
          
          <div className="mt-6 text-center text-sm text-foreground/60">
            Try typing or pasting your code above to receive real-time quality analysis and suggestions
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
