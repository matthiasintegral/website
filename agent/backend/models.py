from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class Category(str, Enum):
    """Mathematical domains"""
    ALGEBRA = "Algebra"
    GEOMETRY = "Geometry"
    CALCULUS = "Calculus"
    STATISTICS = "Statistics"
    NUMBER_THEORY = "Number Theory"
    TRIGONOMETRY = "Trigonometry"
    LINEAR_ALGEBRA = "Linear Algebra"
    DIFFERENTIAL_EQUATIONS = "Differential Equations"

class ExerciseBase(BaseModel):
    """Base exercise model without ID and timestamps"""
    title: str = Field(..., min_length=1, max_length=200, description="Exercise title")
    statement: str = Field(..., min_length=1, description="Mathematical problem statement with LaTeX")
    solution: str = Field(..., min_length=1, description="Complete solution with LaTeX")
    category: Category = Field(..., description="Mathematical domain")

class ExerciseCreate(ExerciseBase):
    """Model for creating a new exercise"""
    pass

class ExerciseUpdate(BaseModel):
    """Model for updating an exercise"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    statement: Optional[str] = Field(None, min_length=1)
    solution: Optional[str] = Field(None, min_length=1)
    category: Optional[Category] = None

class Exercise(ExerciseBase):
    """Complete exercise model with all fields"""
    id: str = Field(..., description="Unique exercise identifier")
    level: str = Field(default="advanced", description="Difficulty level (always advanced)")
    status: str = Field(default="finished", description="Exercise status (always finished)")
    createdAt: datetime = Field(..., description="Creation timestamp")
    imagePaths: List[str] = Field(default_factory=list, description="Paths to uploaded images")
    confidenceScore: float = Field(..., ge=0.0, le=1.0, description="AI confidence in transcription")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "exercise_001",
                "title": "Quadratic Equation Factoring Problem",
                "statement": "Solve the quadratic equation: $x^2 - 7x + 12 = 0$ by factoring.",
                "solution": "Step 1: Factor the quadratic expression\n$x^2 - 7x + 12 = (x - 3)(x - 4)$\n\nStep 2: Set each factor equal to zero\n$x - 3 = 0$ or $x - 4 = 0$\n\nStep 3: Solve for x\n$x = 3$ or $x = 4$",
                "category": "Algebra",
                "level": "advanced",
                "status": "finished",
                "createdAt": "2024-01-15T10:30:00Z",
                "imagePaths": ["images/exercise_001/original_1.jpg"],
                "confidenceScore": 0.95
            }
        }

class ExerciseList(BaseModel):
    """Model for listing exercises with pagination"""
    exercises: List[Exercise]
    total: int
    page: int
    size: int

class AIConversionRequest(BaseModel):
    """Request model for AI image conversion"""
    pass  # Will be handled as multipart form data

class AIConversionResponse(BaseModel):
    """Response model for AI image conversion"""
    title: str
    statement: str
    solution: str
    category: Category
    confidenceScore: float
    message: str = "AI conversion completed successfully" 