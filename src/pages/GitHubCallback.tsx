
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/services/api';
import { Spinner } from '@/components/ui/spinner';

const GitHubCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const authenticateWithGitHub = async () => {
      // Get the authorization code from URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code) {
        setError('No authorization code received from GitHub');
        return;
      }
      
      try {
        // Exchange the code for a token
        await apiClient.authenticateWithGithub(code);
        
        // Redirect to dashboard on success
        navigate('/dashboard');
      } catch (err) {
        console.error('GitHub authentication error:', err);
        setError('Failed to authenticate with GitHub');
      }
    };
    
    authenticateWithGitHub();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">Authentication Error</h1>
            <p className="text-red-600">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
          </div>
        ) : (
          <>
            <Spinner size="lg" className="mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Authenticating with GitHub</h1>
            <p className="text-foreground/60">Please wait while we complete the authentication process...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;
