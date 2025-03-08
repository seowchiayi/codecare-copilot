
import { toast } from "sonner";

// Base API URL - in a production app, you would use environment variables
const API_BASE_URL = "https://api.codequalitycopilot.example";

// Interface for API error responses
interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Authentication interfaces
interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Analysis interfaces
export interface AnalysisRequest {
  language: string;
  code: string;
  projectId?: string;
}

export interface CodeIssue {
  id: string;
  line: number;
  column: number;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  rule: string;
  suggestions?: string[];
}

export interface AnalysisResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  issues: CodeIssue[];
  metrics: {
    complexity: number;
    maintainability: number;
    reliability: number;
    security: number;
    duplication: number;
  };
  timestamp: string;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = {
        status: response.status,
        message: response.statusText || 'Unknown error occurred',
      };
    }
    
    // Show toast notification for API errors
    toast.error(errorData.message || 'API request failed');
    throw errorData;
  }
  
  return response.json() as Promise<T>;
}

// API client class
export class ApiClient {
  private token: string | null = null;
  
  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }
  
  // Get stored token
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }
  
  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
  
  // Create request headers with optional authentication
  private createHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }
  
  // Authentication API
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.createHeaders(false),
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse<AuthResponse>(response);
    this.setToken(data.token);
    return data;
  }
  
  async register(userData: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.createHeaders(false),
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse<AuthResponse>(response);
    this.setToken(data.token);
    return data;
  }
  
  async logout(): Promise<void> {
    this.clearToken();
  }
  
  // Code Analysis API
  async submitAnalysis(request: AnalysisRequest): Promise<{ analysisId: string }> {
    const response = await fetch(`${API_BASE_URL}/analysis/submit`, {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify(request),
    });
    
    return handleResponse<{ analysisId: string }>(response);
  }
  
  async getAnalysisResults(analysisId: string): Promise<AnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/analysis/results/${analysisId}`, {
      method: 'GET',
      headers: this.createHeaders(),
    });
    
    return handleResponse<AnalysisResponse>(response);
  }
  
  // Mock function to get analysis for the demo
  async getMockAnalysis(code: string): Promise<AnalysisResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock response
    return {
      id: Math.random().toString(36).substring(2, 15),
      status: 'completed',
      issues: [
        {
          id: '1',
          line: 3,
          column: 10,
          message: 'Variable "foo" is assigned but never used',
          severity: 'warning',
          rule: 'unused-variable',
          suggestions: ['Remove unused variable', 'Use the variable in your code']
        },
        {
          id: '2',
          line: 7,
          column: 5,
          message: 'Function is too complex (cyclomatic complexity: 15)',
          severity: 'error',
          rule: 'cognitive-complexity',
          suggestions: ['Break down the function into smaller functions']
        },
        {
          id: '3',
          line: 12,
          column: 9,
          message: 'Possible SQL injection vulnerability',
          severity: 'critical',
          rule: 'security-vulnerability',
          suggestions: ['Use parameterized queries instead of string concatenation']
        }
      ],
      metrics: {
        complexity: 65,
        maintainability: 72,
        reliability: 85,
        security: 60,
        duplication: 12
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Create a singleton instance of the API client
export const apiClient = new ApiClient();
