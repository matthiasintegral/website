import pytest
import tempfile
import shutil
from pathlib import Path
from fastapi.testclient import TestClient
from fastapi import FastAPI
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from main import app
from services.storage_service import FileStorageService
from models import ExerciseCreate, Category

@pytest.fixture
def test_app():
    """Create a test FastAPI application instance"""
    return app

@pytest.fixture
def client(test_app):
    """Create a test client for the FastAPI application"""
    return TestClient(test_app)

@pytest.fixture
def temp_data_dir():
    """Create a temporary data directory for testing"""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    # Cleanup after tests
    shutil.rmtree(temp_dir, ignore_errors=True)

@pytest.fixture
def storage_service(temp_data_dir):
    """Create a storage service with temporary data directory"""
    return FileStorageService(data_dir=temp_data_dir)

@pytest.fixture
def sample_exercise_data():
    """Sample exercise data for testing"""
    return {
        "title": "Test Quadratic Equation",
        "statement": "Solve the quadratic equation: $x^2 - 5x + 6 = 0$",
        "solution": "Step 1: Factor the expression\n$x^2 - 5x + 6 = (x - 2)(x - 3)$\n\nStep 2: Set factors to zero\n$x - 2 = 0$ or $x - 3 = 0$\n\nStep 3: Solve\n$x = 2$ or $x = 3$",
        "category": Category.ALGEBRA
    }

@pytest.fixture
def sample_exercise_create(sample_exercise_data):
    """Create an ExerciseCreate instance from sample data"""
    return ExerciseCreate(**sample_exercise_data)

@pytest.fixture
def sample_exercise_update():
    """Sample exercise update data"""
    return {
        "title": "Updated Quadratic Equation",
        "statement": "Solve the updated equation: $x^2 - 6x + 8 = 0$"
    }

@pytest.fixture
def mock_exercise_files():
    """Mock exercise files for testing"""
    return [
        {
            "filename": "test_exercise_1.jpg",
            "content": b"fake_image_content_1"
        },
        {
            "filename": "test_exercise_2.jpg", 
            "content": b"fake_image_content_2"
        }
    ] 