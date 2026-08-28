from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, datasets, analysis

app = FastAPI(
    title="AI Data Analyzer API",
    description="Backend API for AI Data Analyzer",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(datasets.router, prefix="/api/datasets", tags=["datasets"])
app.include_router(analysis.router, prefix="/api/analyze", tags=["analysis"])

@app.get("/")
def read_root():
    return {"message": "AI Data Analyzer API is running"}

