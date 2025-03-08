
import React from 'react';
import { Github, Code, Zap, BarChart4, Sparkles, FileSearch, RefreshCw, Shield } from 'lucide-react';
import { useScrollReveal } from '@/lib/animations';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`rounded-2xl p-6 bg-white border border-border shadow-sm transition-all duration-500 card-hover animate-fade-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ animationDelay: `${0.1 * delay}s` }}
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
}

export function Features() {
  const features = [
    {
      icon: <Code size={24} />,
      title: "Advanced Code Analysis",
      description: "Leverage SonarQube's powerful engine to detect bugs, vulnerabilities, and code smells across multiple languages."
    },
    {
      icon: <Sparkles size={24} />,
      title: "AI-Powered Suggestions",
      description: "Receive intelligent recommendations from our custom PyTorch model, enhanced by GPT-4 for human-readable explanations."
    },
    {
      icon: <FileSearch size={24} />,
      title: "Real-time Feedback",
      description: "Get instant feedback as you code with our integrated Monaco editor, highlighting issues before they make it to production."
    },
    {
      icon: <Github size={24} />,
      title: "GitHub Integration",
      description: "Connect your repositories with a single click and track code quality metrics across your entire codebase."
    },
    {
      icon: <BarChart4 size={24} />,
      title: "Detailed Metrics",
      description: "Track your code quality progress over time with comprehensive dashboards and visual reports."
    },
    {
      icon: <Zap size={24} />,
      title: "Automated Fixes",
      description: "Apply AI-suggested fixes with one click to quickly address common issues and improve your code."
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Continuous Learning",
      description: "Our model improves as you use it, adapting to your coding style and the specific needs of your projects."
    },
    {
      icon: <Shield size={24} />,
      title: "Security Focus",
      description: "Identify potential security vulnerabilities early and receive guidance on implementing secure coding practices."
    }
  ];

  const [sectionRef, isSectionVisible] = useScrollReveal();

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="py-20 md:py-32 bg-secondary/50"
    >
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 animate-fade-up ${isSectionVisible ? 'opacity-100' : 'opacity-0'}`}>
            Powerful Features, Intuitive Design
          </h2>
          <p className={`text-xl text-foreground/70 animate-fade-up reveal-delay-1 ${isSectionVisible ? 'opacity-100' : 'opacity-0'}`}>
            Combining the best analysis tools with cutting-edge AI to elevate your code quality
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
