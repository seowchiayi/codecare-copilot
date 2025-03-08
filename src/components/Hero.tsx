
import React from 'react';
import { Button } from '@/components/ui/button';
import { useScrollReveal } from '@/lib/animations';

export function Hero() {
  const [containerRef, isContainerVisible] = useScrollReveal();
  
  return (
    <section 
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
      ref={containerRef as React.RefObject<HTMLDivElement>}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10" />
      
      {/* Animated circles */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10 animate-float" style={{animationDelay: '1s'}} />

      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-fade-down">
              AI-Powered Code Quality Analysis
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight">
              <span className="heading-mask">
                <span className={`block animate-fade-up ${isContainerVisible ? 'opacity-100' : 'opacity-0'}`}>
                  Elevate Your 
                </span>
              </span>{' '}
              <span className="heading-mask">
                <span className={`block animate-fade-up reveal-delay-1 ${isContainerVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-primary">Code Quality</span>
                </span>
              </span>{' '}
              <span className="heading-mask">
                <span className={`block animate-fade-up reveal-delay-2 ${isContainerVisible ? 'opacity-100' : 'opacity-0'}`}>
                  Effortlessly
                </span>
              </span>
            </h1>
            
            <p className={`text-xl text-foreground/80 max-w-2xl mx-auto pt-4 md:pt-6 animate-fade-up reveal-delay-3 ${isContainerVisible ? 'opacity-100' : 'opacity-0'}`}>
              Combine the power of Sonar analysis with AI-driven insights to identify, prioritize, and fix code issues before they impact your product.
            </p>
          </div>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up reveal-delay-4 ${isContainerVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Button size="lg" className="px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              See Demo
            </Button>
          </div>
          
          <div className={`pt-8 animate-fade-up reveal-delay-5 ${isContainerVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-1 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10">
              <div className="glass-card rounded-xl overflow-hidden">
                <img 
                  src="https://placehold.co/1200x600/f5f9ff/a4c0f2" 
                  alt="CodeQuality Copilot Dashboard" 
                  className="w-full h-auto shadow-md rounded-lg animate-blur-in" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
