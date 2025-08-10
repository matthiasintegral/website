from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from typing import List, Optional
import logging

from models.exercise import (
    Exercise, ExerciseCreate, ExerciseUpdate, ExerciseList, 
    AIConversionResponse, Category
)
from services.storage_service import FileStorageService
from services.ai_service import AIService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize services
storage_service = FileStorageService()
ai_service = AIService()

@router.get("/exercises", response_model=ExerciseList)
async def get_exercises(
    title: Optional[str] = None,
    category: Optional[str] = None
):
    """
    Get all exercises with optional filtering
    
    Args:
        title: Optional search term for exercise titles
        category: Optional category filter
    """
    try:
        exercises = storage_service.search_exercises(title=title, category=category)
        
        return ExerciseList(
            exercises=exercises,
            total=len(exercises),
            page=1,
            size=len(exercises)
        )
    except Exception as e:
        logger.error(f"Error fetching exercises: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch exercises")

@router.get("/exercises/{exercise_id}", response_model=Exercise)
async def get_exercise(exercise_id: str):
    """
    Get a single exercise by ID
    
    Args:
        exercise_id: Unique identifier for the exercise
    """
    try:
        exercise = storage_service.get_exercise(exercise_id)
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        
        return exercise
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching exercise {exercise_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch exercise")

@router.post("/exercises", response_model=Exercise)
async def create_exercise(exercise_data: ExerciseCreate):
    """
    Create a new exercise
    
    Args:
        exercise_data: Exercise data including title, statement, solution, and category
    """
    try:
        # Create exercise with default values
        exercise = storage_service.create_exercise(
            exercise_data=exercise_data,
            confidence_score=1.0  # Manual creation has full confidence
        )
        
        logger.info(f"Created exercise: {exercise.id}")
        return exercise
    except Exception as e:
        logger.error(f"Error creating exercise: {e}")
        raise HTTPException(status_code=500, detail="Failed to create exercise")

@router.post("/exercises/ai-conversion", response_model=AIConversionResponse)
async def convert_image_to_exercise(
    files: List[UploadFile] = File(...)
):
    """
    Convert uploaded images to exercise data using AI
    
    Args:
        files: One or more image files to process
    """
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded")
        
        # Validate all uploaded files
        for file in files:
            if not ai_service.validate_image(file, file.filename):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid image file: {file.filename}"
                )
        
        # Process images with AI
        exercise_data, confidence_score = ai_service.process_images(files, [f.filename for f in files])
        
        # Validate AI output
        if not exercise_data.get("title") or not exercise_data.get("statement") or not exercise_data.get("solution"):
            raise HTTPException(
                status_code=422, 
                detail="AI processing failed to extract complete exercise data"
            )
        
        logger.info(f"AI conversion completed with confidence: {confidence_score}")
        
        return AIConversionResponse(
            title=exercise_data["title"],
            statement=exercise_data["statement"],
            solution=exercise_data["solution"],
            category=exercise_data["category"],
            confidenceScore=confidence_score
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in AI conversion: {e}")
        raise HTTPException(status_code=500, detail="AI conversion failed")

@router.put("/exercises/{exercise_id}", response_model=Exercise)
async def update_exercise(
    exercise_id: str,
    update_data: ExerciseUpdate
):
    """
    Update an existing exercise
    
    Args:
        exercise_id: Unique identifier for the exercise
        update_data: Updated exercise data
    """
    try:
        exercise = storage_service.update_exercise(exercise_id, update_data)
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        
        logger.info(f"Updated exercise: {exercise_id}")
        return exercise
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating exercise {exercise_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update exercise")

@router.delete("/exercises/{exercise_id}")
async def delete_exercise(exercise_id: str):
    """
    Delete an exercise
    
    Args:
        exercise_id: Unique identifier for the exercise
    """
    try:
        success = storage_service.delete_exercise(exercise_id)
        if not success:
            raise HTTPException(status_code=404, detail="Exercise not found")
        
        logger.info(f"Deleted exercise: {exercise_id}")
        return {"message": "Exercise deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting exercise {exercise_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete exercise")

@router.get("/exercises/categories")
async def get_categories():
    """Get all available mathematical categories"""
    return [category.value for category in Category]

@router.get("/exercises/stats")
async def get_exercise_stats():
    """Get exercise statistics"""
    try:
        total_exercises = storage_service.get_exercise_count()
        categories = storage_service.get_all_exercises()
        
        # Count by category
        category_counts = {}
        for exercise in categories:
            cat = exercise.category.value
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        return {
            "total_exercises": total_exercises,
            "category_distribution": category_counts
        }
    except Exception as e:
        logger.error(f"Error fetching exercise stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch exercise statistics") 