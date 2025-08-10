from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

from routers import exercises

# Create data directories if they don't exist
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)
(data_dir / "exercises").mkdir(exist_ok=True)
(data_dir / "images").mkdir(exist_ok=True)

app = FastAPI(
    title="Math Exercises API",
    description="API for mathematical exercises with AI handwriting recognition",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(exercises.router, prefix="/api", tags=["exercises"])

# Mount static files for images
app.mount("/images", StaticFiles(directory="data/images"), name="images")

@app.get("/")
async def root():
    return {"message": "Math Exercises API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 