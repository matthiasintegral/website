#!/usr/bin/env python3
"""
FastAPI server startup script for Math Exercises Backend
"""

import uvicorn
import os
from pathlib import Path

if __name__ == "__main__":
    # Set default port
    port = int(os.getenv("PORT", 8000))
    
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    
    # Change to the script directory to ensure relative paths work
    os.chdir(script_dir)
    
    print(f"Starting Math Exercises Backend on port {port}")
    print(f"Working directory: {os.getcwd()}")
    print(f"API documentation: http://localhost:{port}/docs")
    print(f"Health check: http://localhost:{port}/health")
    
    # Start the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    ) 