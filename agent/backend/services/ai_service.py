import sys
import os
from pathlib import Path
from typing import List, Tuple
import tempfile
from PIL import Image

# Add the parent directory to sys.path to import the math agent
sys.path.append(str(Path(__file__).parent.parent.parent))
from math_agent_v0 import MathExerciseAnalyzer

class AIService:
    """Service for AI-powered image processing and exercise extraction"""
    
    def __init__(self):
        """Initialize the AI service with the math exercise analyzer"""
        try:
            self.analyzer = MathExerciseAnalyzer()
        except Exception as e:
            print(f"Warning: Could not initialize MathExerciseAnalyzer: {e}")
            self.analyzer = None
    
    def process_images(self, image_files: List, filenames: List[str]) -> Tuple[dict, float]:
        """
        Process uploaded images to extract exercise data
        
        Args:
            image_files: List of uploaded file objects
            filenames: List of corresponding filenames
            
        Returns:
            Tuple of (exercise_data, confidence_score)
        """
        if not self.analyzer:
            raise Exception("AI service not properly initialized")
        
        # Save uploaded files to temporary location for processing
        temp_image_paths = []
        try:
            for image_file, filename in zip(image_files, filenames):
                # Create temporary file
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=Path(filename).suffix)
                temp_file.write(image_file.file.read())
                temp_file.close()
                temp_image_paths.append(temp_file.name)
            
            # Process images with the math agent
            exercise = self.analyzer.analyze_exercise(temp_image_paths)
            
            # Convert to our data format
            exercise_data = {
                "title": exercise.title,
                "statement": exercise.statement,
                "solution": exercise.response,  # Note: agent uses 'response', we use 'solution'
                "category": exercise.domain,
                "confidenceScore": exercise.confidence_score
            }
            
            return exercise_data, exercise.confidence_score
            
        finally:
            # Clean up temporary files
            for temp_path in temp_image_paths:
                try:
                    os.unlink(temp_path)
                except OSError:
                    pass
    
    def process_single_image(self, image_file, filename: str) -> Tuple[dict, float]:
        """
        Process a single uploaded image
        
        Args:
            image_file: Uploaded file object
            filename: Original filename
            
        Returns:
            Tuple of (exercise_data, confidence_score)
        """
        return self.process_images([image_file], [filename])
    
    def validate_image(self, image_file, filename: str) -> bool:
        """
        Validate uploaded image file
        
        Args:
            image_file: Uploaded file object
            filename: Original filename
            
        Returns:
            True if image is valid, False otherwise
        """
        try:
            # Check file extension
            allowed_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}
            file_ext = Path(filename).suffix.lower()
            
            if file_ext not in allowed_extensions:
                return False
            
            # Try to open image with PIL to validate it's a real image
            image_file.file.seek(0)  # Reset file pointer
            image = Image.open(image_file.file)
            image.verify()  # Verify image integrity
            
            return True
            
        except Exception:
            return False
    
    def get_health_status(self) -> dict:
        """Get the health status of the AI service"""
        return {
            "status": "healthy" if self.analyzer else "unhealthy",
            "analyzer_available": self.analyzer is not None,
            "service": "AI Math Exercise Analyzer"
        } 