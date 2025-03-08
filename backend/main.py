
from fastapi import FastAPI, HTTPException, Depends, Body, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union, Any
import uuid
import jwt
import os
import httpx
import tempfile
import shutil
import subprocess
import json
from datetime import datetime, timedelta
from github import Github
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="CodeQuality Copilot API",
    description="API for Python code quality analysis using SonarPython",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")

# --- Models ---

class AuthRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: Dict[str, str]

class GithubAuthRequest(BaseModel):
    code: str

class Repository(BaseModel):
    id: str
    name: str
    full_name: str
    description: Optional[str] = None
    url: str
    language: Optional[str] = None
    default_branch: str

class AnalysisRequest(BaseModel):
    repository_id: str
    branch: Optional[str] = None

class SonarIssue(BaseModel):
    id: str
    rule: str
    severity: str
    component: str
    line: Optional[int] = None
    message: str
    type: str
    status: str
    
class SonarMetrics(BaseModel):
    code_smells: int
    bugs: int
    vulnerabilities: int
    security_hotspots: int
    duplicated_lines_density: float
    coverage: Optional[float] = None
    reliability_rating: str
    security_rating: str
    maintainability_rating: str
    
class AnalysisResponse(BaseModel):
    id: str
    status: str = "completed"
    repository: str
    branch: str
    issues: List[SonarIssue]
    metrics: SonarMetrics
    timestamp: str

# --- Authentication ---

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(authorization: Optional[str] = Header(None)):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# --- GitHub Authentication ---

async def exchange_code_for_token(code: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange GitHub code for token")
        
        data = response.json()
        return data.get("access_token")

async def get_github_user(token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get GitHub user")
        
        return response.json()

# --- SonarPython Integration ---

async def analyze_repository(repository_url: str, branch: str, analysis_id: str):
    """Run SonarPython analysis on a GitHub repository"""
    temp_dir = tempfile.mkdtemp()
    
    try:
        # Clone repository
        subprocess.run(["git", "clone", "--branch", branch, "--depth", "1", repository_url, temp_dir], check=True)
        
        # Setup SonarScanner properties
        sonar_properties = f"""
        sonar.projectKey=github_{analysis_id}
        sonar.projectName=GitHub Analysis {analysis_id}
        sonar.projectVersion=1.0
        sonar.sources=.
        sonar.python.coverage.reportPaths=coverage-reports/*coverage-*.xml
        sonar.python.xunit.reportPath=xunit-reports/*.xml
        """
        
        with open(os.path.join(temp_dir, "sonar-project.properties"), "w") as f:
            f.write(sonar_properties)
        
        # Run SonarScanner
        sonar_scanner_output = os.path.join(temp_dir, "sonar-output.json")
        subprocess.run([
            "sonar-scanner",
            "-Dsonar.host.url=http://localhost:9000",  # Sonar host
            f"-Dsonar.projectBaseDir={temp_dir}",
            f"-Dsonar.working.directory={temp_dir}/.scannerwork",
            "-Dsonar.python.pylint.reportPaths=pylint-reports/*.txt",
            "-Dsonar.verbose=true",
            f"-Dsonar.projectKey=github_{analysis_id}",
            "-Dsonar.scanner.metadataFilePath=" + sonar_scanner_output
        ], check=True)
        
        # For demo purposes, we'll return mock data since setting up a full SonarQube instance is complex
        # In a real implementation, you would parse sonar_scanner_output or query the SonarQube API
        
        return create_mock_analysis_results(repository_url, branch, analysis_id)
    
    except Exception as e:
        print(f"Error analyzing repository: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze repository: {str(e)}")
    
    finally:
        # Clean up temp directory
        shutil.rmtree(temp_dir, ignore_errors=True)

def create_mock_analysis_results(repository_url: str, branch: str, analysis_id: str):
    """Create mock analysis results for demo purposes"""
    return {
        "id": analysis_id,
        "repository": repository_url,
        "branch": branch,
        "issues": [
            {
                "id": str(uuid.uuid4()),
                "rule": "python:S1192",
                "severity": "MAJOR",
                "component": "src/main.py",
                "line": 25,
                "message": "Define a constant instead of duplicating this literal 'config' 3 times.",
                "type": "CODE_SMELL",
                "status": "OPEN"
            },
            {
                "id": str(uuid.uuid4()),
                "rule": "python:S5747",
                "severity": "CRITICAL",
                "component": "src/auth.py",
                "line": 42,
                "message": "Use secure cipher modes: using CBC with PKCS5/PKCS7 padding is vulnerable to padding oracle attacks.",
                "type": "VULNERABILITY",
                "status": "OPEN"
            },
            {
                "id": str(uuid.uuid4()),
                "rule": "python:S5754",
                "severity": "BLOCKER",
                "component": "src/api.py",
                "line": 78,
                "message": "Permissive CORS policy leaves application open to cross-domain requests.",
                "type": "VULNERABILITY",
                "status": "OPEN"
            }
        ],
        "metrics": {
            "code_smells": 47,
            "bugs": 12,
            "vulnerabilities": 2,
            "security_hotspots": 8,
            "duplicated_lines_density": 5.2,
            "coverage": 68.4,
            "reliability_rating": "B",
            "security_rating": "C",
            "maintainability_rating": "B"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# --- Routes ---

@app.post("/auth/login", response_model=TokenResponse)
async def login(request: AuthRequest):
    # In a real application, validate credentials against database
    # For demo purposes, we'll accept any login
    
    # Generate a token
    token = create_access_token({"sub": str(uuid.uuid4())})
    
    return {
        "token": token,
        "user": {
            "id": str(uuid.uuid4()),
            "email": request.email,
            "name": request.email.split("@")[0]
        }
    }

@app.post("/auth/github", response_model=TokenResponse)
async def github_auth(request: GithubAuthRequest):
    """Authenticate with GitHub OAuth code"""
    try:
        # Exchange code for GitHub token
        github_token = await exchange_code_for_token(request.code)
        
        # Get GitHub user info
        github_user = await get_github_user(github_token)
        
        # Generate application token
        token = create_access_token({
            "sub": str(github_user.get("id")),
            "github_token": github_token
        })
        
        return {
            "token": token,
            "user": {
                "id": str(github_user.get("id")),
                "email": github_user.get("email", ""),
                "name": github_user.get("name", github_user.get("login")),
                "avatar_url": github_user.get("avatar_url", "")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"GitHub authentication failed: {str(e)}")

@app.get("/repositories", response_model=List[Repository])
async def list_repositories(user_id: str = Depends(verify_token)):
    """List GitHub repositories for the authenticated user"""
    try:
        # Extract GitHub token from JWT
        token_data = jwt.decode(
            user_id.replace("Bearer ", ""), 
            SECRET_KEY, 
            algorithms=[ALGORITHM]
        )
        github_token = token_data.get("github_token")
        
        if not github_token:
            raise HTTPException(status_code=400, detail="GitHub token not found")
        
        # Initialize GitHub client
        g = Github(github_token)
        user = g.get_user()
        
        # Get repositories
        repos = []
        for repo in user.get_repos():
            if repo.language and repo.language.lower() == "python":
                repos.append({
                    "id": str(repo.id),
                    "name": repo.name,
                    "full_name": repo.full_name,
                    "description": repo.description,
                    "url": repo.html_url,
                    "language": repo.language,
                    "default_branch": repo.default_branch
                })
        
        return repos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list repositories: {str(e)}")

@app.post("/analysis/repository", response_model=Dict[str, str])
async def analyze_repository_endpoint(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(verify_token)
):
    """Submit a GitHub repository for analysis"""
    try:
        # Extract GitHub token from JWT
        token_data = jwt.decode(
            user_id.replace("Bearer ", ""), 
            SECRET_KEY, 
            algorithms=[ALGORITHM]
        )
        github_token = token_data.get("github_token")
        
        if not github_token:
            raise HTTPException(status_code=400, detail="GitHub token not found")
        
        # Get repository details
        g = Github(github_token)
        repo = g.get_repo(int(request.repository_id))
        
        # Generate analysis ID
        analysis_id = str(uuid.uuid4())
        
        # Set branch
        branch = request.branch or repo.default_branch
        
        # Start analysis in background
        background_tasks.add_task(
            analyze_repository,
            repo.clone_url,
            branch,
            analysis_id
        )
        
        return {"analysisId": analysis_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit repository for analysis: {str(e)}")

@app.get("/analysis/results/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis_results(
    analysis_id: str,
    user_id: str = Depends(verify_token)
):
    """Get repository analysis results"""
    # In a real application, fetch results from database
    # For demo, return mock data
    
    mock_data = create_mock_analysis_results(
        "https://github.com/example/repo.git",
        "main",
        analysis_id
    )
    
    return {
        "id": analysis_id,
        "status": "completed",
        "repository": mock_data["repository"],
        "branch": mock_data["branch"],
        "issues": mock_data["issues"],
        "metrics": mock_data["metrics"],
        "timestamp": mock_data["timestamp"]
    }

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
