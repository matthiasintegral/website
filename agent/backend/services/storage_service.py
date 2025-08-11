import json
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from models import Exercise, ExerciseCreate, ExerciseUpdate

class FileStorageService:
    """File-based storage service for exercises"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.exercises_dir = self.data_dir / "exercises"
        self.images_dir = self.data_dir / "images"
        
        # Ensure directories exist
        self.exercises_dir.mkdir(parents=True, exist_ok=True)
        self.images_dir.mkdir(parents=True, exist_ok=True)
    
    def _generate_exercise_id(self) -> str:
        """Generate a unique exercise ID"""
        return f"exercise_{str(uuid.uuid4())[:8]}"
    
    def _get_title_with_suffix(self, base_title: str) -> str:
        """Add suffix number to title if duplicate exists"""
        existing_titles = self._get_all_titles()
        
        if base_title not in existing_titles:
            return base_title
        
        # Find the highest suffix number
        suffix = 1
        while f"{base_title} ({suffix})" in existing_titles:
            suffix += 1
        
        return f"{base_title} ({suffix})"
    
    def _get_all_titles(self) -> List[str]:
        """Get all existing exercise titles"""
        titles = []
        for file_path in self.exercises_dir.glob("*.json"):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    titles.append(data.get('title', ''))
            except (json.JSONDecodeError, IOError):
                continue
        return titles
    
    def _get_exercise_file_path(self, exercise_id: str) -> Path:
        """Get the file path for an exercise"""
        return self.exercises_dir / f"{exercise_id}.json"
    
    def create_exercise(self, exercise_data: ExerciseCreate, image_paths: List[str] = None, confidence_score: float = 0.0) -> Exercise:
        """Create a new exercise"""
        exercise_id = self._generate_exercise_id()
        
        # Handle title deduplication
        final_title = self._get_title_with_suffix(exercise_data.title)
        
        exercise = Exercise(
            id=exercise_id,
            title=final_title,
            statement=exercise_data.statement,
            solution=exercise_data.solution,
            category=exercise_data.category,
            level="advanced",
            status="finished",
            createdAt=datetime.utcnow(),
            imagePaths=image_paths or [],
            confidenceScore=confidence_score
        )
        
        # Save to file
        file_path = self._get_exercise_file_path(exercise_id)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(exercise.dict(), f, default=str, indent=2, ensure_ascii=False)
        
        return exercise
    
    def get_exercise(self, exercise_id: str) -> Optional[Exercise]:
        """Get an exercise by ID"""
        file_path = self._get_exercise_file_path(exercise_id)
        
        if not file_path.exists():
            return None
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return Exercise(**data)
        except (json.JSONDecodeError, IOError):
            return None
    
    def get_all_exercises(self) -> List[Exercise]:
        """Get all exercises"""
        exercises = []
        
        for file_path in self.exercises_dir.glob("*.json"):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    exercises.append(Exercise(**data))
            except (json.JSONDecodeError, IOError):
                continue
        
        # Sort by creation date (newest first)
        exercises.sort(key=lambda x: x.createdAt, reverse=True)
        return exercises
    
    def search_exercises(self, title: Optional[str] = None, category: Optional[str] = None) -> List[Exercise]:
        """Search exercises by title and/or category"""
        exercises = self.get_all_exercises()
        
        if title:
            title_lower = title.lower()
            exercises = [ex for ex in exercises if title_lower in ex.title.lower()]
        
        if category:
            exercises = [ex for ex in exercises if ex.category.value == category]
        
        return exercises
    
    def update_exercise(self, exercise_id: str, update_data: ExerciseUpdate) -> Optional[Exercise]:
        """Update an existing exercise"""
        exercise = self.get_exercise(exercise_id)
        if not exercise:
            return None
        
        # Update fields
        update_dict = update_data.dict(exclude_unset=True)
        for field, value in update_dict.items():
            if field == "title" and value:
                # Handle title deduplication for updates
                value = self._get_title_with_suffix(value)
            setattr(exercise, field, value)
        
        # Save updated exercise
        file_path = self._get_exercise_file_path(exercise_id)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(exercise.dict(), f, default=str, indent=2, ensure_ascii=False)
        
        return exercise
    
    def delete_exercise(self, exercise_id: str) -> bool:
        """Delete an exercise"""
        file_path = self._get_exercise_file_path(exercise_id)
        
        if not file_path.exists():
            return False
        
        try:
            file_path.unlink()
            return True
        except IOError:
            return False
    
    def get_exercise_count(self) -> int:
        """Get total number of exercises"""
        return len(list(self.exercises_dir.glob("*.json")))
    
    def save_image(self, exercise_id: str, image_file, filename: str) -> str:
        """Save an uploaded image for an exercise"""
        exercise_images_dir = self.images_dir / exercise_id
        exercise_images_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        file_extension = Path(filename).suffix
        unique_filename = f"{uuid.uuid4().hex}{file_extension}"
        file_path = exercise_images_dir / unique_filename
        
        # Save the file
        with open(file_path, "wb") as buffer:
            buffer.write(image_file.file.read())
        
        # Return the relative path for storage in exercise
        return f"images/{exercise_id}/{unique_filename}" 