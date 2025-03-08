
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Button } from '@/components/ui/button';
import { CodeComparison } from '@/components/CodeCard';
import { useScrollReveal } from '@/lib/animations';

const Index = () => {
  const [demoRef, isDemoVisible] = useScrollReveal();
  const [ctaRef, isCtaVisible] = useScrollReveal();
  
  // Sample code for the demo section
  const beforeCode = `// Function with potential issues
function calculateTotal(prices) {
  let total = 0;
  
  for (var i = 0; i < prices.length; i++) {
    total = total + prices[i];
  }
  
  return total;
}`;

  const afterCode = `/**
 * Calculates the sum of all prices
 * @param {number[]} prices - Array of prices
 * @returns {number} The total sum
 */
function calculateTotal(prices) {
  if (!prices || !Array.isArray(prices)) {
    return 0;
  }
  
  return prices.reduce((total, price) => total + price, 0);
}`;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        <Features />
        
        {/* Demo Section */}
        <section 
          ref={demoRef as React.RefObject<HTMLDivElement>}
          className="py-20 md:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 animate-fade-up ${isDemoVisible ? 'opacity-100' : 'opacity-0'}`}>
                See It In Action
              </h2>
              <p className={`text-xl text-foreground/70 animate-fade-up reveal-delay-1 ${isDemoVisible ? 'opacity-100' : 'opacity-0'}`}>
                Our AI-powered suggestions transform your code for better quality, readability, and maintainability
              </p>
            </div>
            
            <div className={`animate-fade-up reveal-delay-2 ${isDemoVisible ? 'opacity-100' : 'opacity-0'}`}>
              <CodeComparison 
                title="Code Transformation"
                language="javascript"
                beforeCode={beforeCode}
                afterCode={afterCode}
                className="max-w-5xl mx-auto"
              />
            </div>
            
            <div className={`text-center mt-12 animate-fade-up reveal-delay-3 ${isDemoVisible ? 'opacity-100' : 'opacity-0'}`}>
              <Button size="lg" className="px-8">
                Try Live Demo
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section 
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className="py-20 bg-gradient-to-b from-background to-primary/5"
        >
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 animate-fade-up ${isCtaVisible ? 'opacity-100' : 'opacity-0'}`}>
                Ready to Elevate Your Code Quality?
              </h2>
              <p className={`text-xl text-foreground/70 animate-fade-up reveal-delay-1 ${isCtaVisible ? 'opacity-100' : 'opacity-0'}`}>
                Join developers who are shipping cleaner, safer, and more maintainable code with CodeQuality Copilot
              </p>
              
              <div className={`pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up reveal-delay-2 ${isCtaVisible ? 'opacity-100' : 'opacity-0'}`}>
                <Button size="lg" className="px-8">
                  Start For Free
                </Button>
                <Button variant="outline" size="lg">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CodeQuality</h3>
              <p className="text-sm text-foreground/70">
                AI-powered code quality analysis for modern development teams.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-foreground/60">
            © {new Date().getFullYear()} CodeQuality Copilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
