
from fastapi import FastAPI, HTTPException, Depends, Body, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union, Any
import uuid
import jwt
from datetime import datetime, timedelta
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="CodeQuality Copilot API",
    description="API for code quality analysis",
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

# Secret key for JWT
SECRET_KEY = "your-secret-key"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Models ---

class AuthRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: Dict[str, str]

class AnalysisRequest(BaseModel):
    language: str
    code: str
    project_id: Optional[str] = None

class CodeIssue(BaseModel):
    id: str
    line: int
    column: int
    message: str
    severity: str
    rule: str
    suggestions: Optional[List[str]] = None

class AnalysisMetrics(BaseModel):
    complexity: float
    maintainability: float
    reliability: float
    security: float
    duplication: float

class AnalysisResponse(BaseModel):
    id: str
    status: str
    issues: List[CodeIssue]
    metrics: AnalysisMetrics
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

@app.post("/auth/register", response_model=TokenResponse)
async def register(request: AuthRequest):
    # In a real application, create user in database
    # For demo purposes, we'll just return a token
    
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

@app.post("/analysis/submit")
async def submit_analysis(
    request: AnalysisRequest,
    user_id: str = Depends(verify_token)
):
    # In a real application, queue the analysis job
    analysis_id = str(uuid.uuid4())
    
    return {"analysisId": analysis_id}

@app.get("/analysis/results/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis_results(
    analysis_id: str,
    user_id: str = Depends(verify_token)
):
    # In a real application, fetch results from database
    # For demo, return mock data
    
    return {
        "id": analysis_id,
        "status": "completed",
        "issues": [
            {
                "id": "1",
                "line": 3,
                "column": 10,
                "message": "Variable 'foo' is assigned but never used",
                "severity": "warning",
                "rule": "unused-variable",
                "suggestions": ["Remove unused variable", "Use the variable in your code"]
            },
            {
                "id": "2",
                "line": 7,
                "column": 5,
                "message": "Function is too complex (cyclomatic complexity: 15)",
                "severity": "error",
                "rule": "cognitive-complexity",
                "suggestions": ["Break down the function into smaller functions"]
            }
        ],
        "metrics": {
            "complexity": 65,
            "maintainability": 72,
            "reliability": 85,
            "security": 60,
            "duplication": 12
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
