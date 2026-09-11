from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

app = FastAPI(
    title="Polaris API",
    description="Backend for the Polaris AI-Powered Polar Knowledge Intelligence Layer",
    version="0.1.0",
)

import os

# Allow frontend origins dynamically via env var, falling back to localhost for dev
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

# Configure CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Polaris API"}
