
import { toast } from "sonner";

// Base API URL from environment or default to localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

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

interface GithubAuthRequest {
  code: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
  };
}

// Repository interfaces
export interface Repository {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  url: string;
  language?: string;
  default_branch: string;
}

// Analysis interfaces
export interface AnalysisRequest {
  repository_id: string;
  branch?: string;
}

export interface SonarIssue {
  id: string;
  rule: string;
  severity: string;
  component: string;
  line?: number;
  message: string;
  type: string;
  status: string;
}

export interface SonarMetrics {
  code_smells: number;
  bugs: number;
  vulnerabilities: number;
  security_hotspots: number;
  duplicated_lines_density: number;
  coverage?: number;
  reliability_rating: string;
  security_rating: string;
  maintainability_rating: string;
}

export interface AnalysisResponse {
  id: string;
  status: string;
  repository: string;
  branch: string;
  issues: SonarIssue[];
  metrics: SonarMetrics;
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
  
  // GitHub Authentication
  
  // Get GitHub OAuth URL
  getGithubAuthUrl() {
    const redirectUri = `${window.location.origin}/github-callback`;
    return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo`;
  }
  
  // Exchange GitHub code for token
  async authenticateWithGithub(code: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/github`, {
      method: 'POST',
      headers: this.createHeaders(false),
      body: JSON.stringify({ code }),
    });
    
    const data = await handleResponse<AuthResponse>(response);
    this.setToken(data.token);
    return data;
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
  
  // Repository API
  async getRepositories(): Promise<Repository[]> {
    const response = await fetch(`${API_BASE_URL}/repositories`, {
      method: 'GET',
      headers: this.createHeaders(),
    });
    
    return handleResponse<Repository[]>(response);
  }
  
  // Code Analysis API
  async submitRepositoryAnalysis(request: AnalysisRequest): Promise<{ analysisId: string }> {
    const response = await fetch(`${API_BASE_URL}/analysis/repository`, {
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
}

// Create a singleton instance of the API client
export const apiClient = new ApiClient();
