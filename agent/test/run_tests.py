#!/usr/bin/env python3
"""
Test runner script for Math Exercises API
Run this script to execute all tests
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    """Main test runner function"""
    # Get the directory where this script is located
    test_dir = Path(__file__).parent
    backend_dir = test_dir.parent / "backend"
    
    # Change to the backend directory to run tests
    os.chdir(backend_dir)
    
    print("🧪 Running Math Exercises API Tests")
    print("=" * 50)
    
    # Run pytest with verbose output
    cmd = [
        sys.executable, "-m", "pytest",
        str(test_dir),
        "-v",
        "--tb=short",
        "--color=yes"
    ]
    
    try:
        result = subprocess.run(cmd, check=True)
        print("\n✅ All tests passed!")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Tests failed with exit code {e.returncode}")
        return e.returncode
    except Exception as e:
        print(f"\n💥 Error running tests: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 