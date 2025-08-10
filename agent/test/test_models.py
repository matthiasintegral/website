import pytest
from datetime import datetime
from models.exercise import (
    ExerciseBase, ExerciseCreate, ExerciseUpdate, Exercise, 
    ExerciseList, AIConversionRequest, AIConversionResponse, Category
)

class TestExerciseModels:
    """Test cases for exercise data models"""
    
    def test_exercise_base_valid(self):
        """Test ExerciseBase with valid data"""
        data = {
            "title": "Test Exercise",
            "statement": "Test statement with LaTeX: $x^2 + 2x + 1 = 0$",
            "solution": "Test solution with steps",
            "category": Category.ALGEBRA
        }
        
        exercise = ExerciseBase(**data)
        
        assert exercise.title == data["title"]
        assert exercise.statement == data["statement"]
        assert exercise.solution == data["solution"]
        assert exercise.category == data["category"]
    
    def test_exercise_base_title_validation(self):
        """Test ExerciseBase title validation"""
        # Test minimum length
        with pytest.raises(ValueError):
            ExerciseBase(
                title="",  # Empty title
                statement="Test statement",
                solution="Test solution",
                category=Category.ALGEBRA
            )
        
        # Test maximum length
        long_title = "A" * 201  # 201 characters
        with pytest.raises(ValueError):
            ExerciseBase(
                title=long_title,
                statement="Test statement",
                solution="Test solution",
                category=Category.ALGEBRA
            )
    
    def test_exercise_base_statement_validation(self):
        """Test ExerciseBase statement validation"""
        with pytest.raises(ValueError):
            ExerciseBase(
                title="Test Exercise",
                statement="",  # Empty statement
                solution="Test solution",
                category=Category.ALGEBRA
            )
    
    def test_exercise_base_solution_validation(self):
        """Test ExerciseBase solution validation"""
        with pytest.raises(ValueError):
            ExerciseBase(
                title="Test Exercise",
                statement="Test statement",
                solution="",  # Empty solution
                category=Category.ALGEBRA
            )
    
    def test_exercise_create_inheritance(self):
        """Test that ExerciseCreate inherits from ExerciseBase"""
        data = {
            "title": "Test Exercise",
            "statement": "Test statement",
            "solution": "Test solution",
            "category": Category.GEOMETRY
        }
        
        exercise = ExerciseCreate(**data)
        
        # Should have all ExerciseBase fields
        assert exercise.title == data["title"]
        assert exercise.statement == data["statement"]
        assert exercise.solution == data["solution"]
        assert exercise.category == data["category"]
        
        # Should be instance of ExerciseBase
        assert isinstance(exercise, ExerciseBase)
    
    def test_exercise_update_optional_fields(self):
        """Test ExerciseUpdate with optional fields"""
        # Test with no fields
        update = ExerciseUpdate()
        assert update.title is None
        assert update.statement is None
        assert update.solution is None
        assert update.category is None
        
        # Test with some fields
        update = ExerciseUpdate(title="Updated Title", category=Category.CALCULUS)
        assert update.title == "Updated Title"
        assert update.category == Category.CALCULUS
        assert update.statement is None
        assert update.solution is None
    
    def test_exercise_update_validation(self):
        """Test ExerciseUpdate field validation"""
        # Test invalid title
        with pytest.raises(ValueError):
            ExerciseUpdate(title="")  # Empty title
        
        # Test invalid title length
        with pytest.raises(ValueError):
            ExerciseUpdate(title="A" * 201)  # Too long
    
    def test_exercise_complete_model(self):
        """Test complete Exercise model"""
        now = datetime.utcnow()
        data = {
            "id": "exercise_123",
            "title": "Complete Exercise",
            "statement": "Complete statement",
            "solution": "Complete solution",
            "category": Category.STATISTICS,
            "level": "advanced",
            "status": "finished",
            "createdAt": now,
            "imagePaths": ["images/ex1/img1.jpg", "images/ex1/img2.jpg"],
            "confidenceScore": 0.95
        }
        
        exercise = Exercise(**data)
        
        assert exercise.id == data["id"]
        assert exercise.title == data["title"]
        assert exercise.statement == data["statement"]
        assert exercise.solution == data["solution"]
        assert exercise.category == data["category"]
        assert exercise.level == data["level"]
        assert exercise.status == data["status"]
        assert exercise.createdAt == data["createdAt"]
        assert exercise.imagePaths == data["imagePaths"]
        assert exercise.confidenceScore == data["confidenceScore"]
    
    def test_exercise_default_values(self):
        """Test Exercise model default values"""
        data = {
            "id": "exercise_123",
            "title": "Test Exercise",
            "statement": "Test statement",
            "solution": "Test solution",
            "category": Category.TRIGONOMETRY,
            "createdAt": datetime.utcnow(),
            "confidenceScore": 0.8
        }
        
        exercise = Exercise(**data)
        
        # Check defaults
        assert exercise.level == "advanced"
        assert exercise.status == "finished"
        assert exercise.imagePaths == []
    
    def test_exercise_confidence_score_validation(self):
        """Test Exercise confidence score validation"""
        data = {
            "id": "exercise_123",
            "title": "Test Exercise",
            "statement": "Test statement",
            "solution": "Test solution",
            "category": Category.LINEAR_ALGEBRA,
            "createdAt": datetime.utcnow()
        }
        
        # Test valid confidence scores
        exercise = Exercise(**data, confidenceScore=0.0)
        assert exercise.confidenceScore == 0.0
        
        exercise = Exercise(**data, confidenceScore=1.0)
        assert exercise.confidenceScore == 1.0
        
        exercise = Exercise(**data, confidenceScore=0.5)
        assert exercise.confidenceScore == 0.5
        
        # Test invalid confidence scores
        with pytest.raises(ValueError):
            Exercise(**data, confidenceScore=-0.1)
        
        with pytest.raises(ValueError):
            Exercise(**data, confidenceScore=1.1)
    
    def test_exercise_list_model(self):
        """Test ExerciseList model"""
        exercises = [
            Exercise(
                id="ex1",
                title="Exercise 1",
                statement="Statement 1",
                solution="Solution 1",
                category=Category.ALGEBRA,
                createdAt=datetime.utcnow(),
                confidenceScore=0.9
            ),
            Exercise(
                id="ex2",
                title="Exercise 2",
                statement="Statement 2",
                solution="Solution 2",
                category=Category.GEOMETRY,
                createdAt=datetime.utcnow(),
                confidenceScore=0.8
            )
        ]
        
        exercise_list = ExerciseList(
            exercises=exercises,
            total=2,
            page=1,
            size=10
        )
        
        assert len(exercise_list.exercises) == 2
        assert exercise_list.total == 2
        assert exercise_list.page == 1
        assert exercise_list.size == 10
    
    def test_ai_conversion_response_model(self):
        """Test AIConversionResponse model"""
        data = {
            "title": "AI Generated Exercise",
            "statement": "AI generated statement",
            "solution": "AI generated solution",
            "category": Category.DIFFERENTIAL_EQUATIONS,
            "confidenceScore": 0.87
        }
        
        response = AIConversionResponse(**data)
        
        assert response.title == data["title"]
        assert response.statement == data["statement"]
        assert response.solution == data["solution"]
        assert response.category == data["category"]
        assert response.confidenceScore == data["confidenceScore"]
        assert response.message == "AI conversion completed successfully"
    
    def test_ai_conversion_response_custom_message(self):
        """Test AIConversionResponse with custom message"""
        data = {
            "title": "Custom Exercise",
            "statement": "Custom statement",
            "solution": "Custom solution",
            "category": Category.NUMBER_THEORY,
            "confidenceScore": 0.92,
            "message": "Custom success message"
        }
        
        response = AIConversionResponse(**data)
        assert response.message == "Custom success message"
    
    def test_category_enum_values(self):
        """Test Category enum values"""
        expected_categories = [
            "Algebra", "Geometry", "Calculus", "Statistics",
            "Number Theory", "Trigonometry", "Linear Algebra",
            "Differential Equations"
        ]
        
        for category_value in expected_categories:
            category = Category(category_value)
            assert category.value == category_value
    
    def test_exercise_json_schema_extra(self):
        """Test Exercise model example in JSON schema"""
        # The example should be valid Exercise data
        example_data = Exercise.Config.json_schema_extra["example"]
        
        # Create Exercise from example data
        exercise = Exercise(**example_data)
        
        assert exercise.id == "exercise_001"
        assert exercise.title == "Quadratic Equation Factoring Problem"
        assert exercise.category == Category.ALGEBRA
        assert exercise.level == "advanced"
        assert exercise.status == "finished"
        assert exercise.confidenceScore == 0.95
    
    def test_model_serialization(self):
        """Test that models can be serialized to JSON"""
        exercise = Exercise(
            id="test_123",
            title="Serialization Test",
            statement="Test statement",
            solution="Test solution",
            category=Category.CALCULUS,
            createdAt=datetime.utcnow(),
            confidenceScore=0.75
        )
        
        # Convert to dict
        exercise_dict = exercise.dict()
        
        # Should contain all fields
        assert "id" in exercise_dict
        assert "title" in exercise_dict
        assert "statement" in exercise_dict
        assert "solution" in exercise_dict
        assert "category" in exercise_dict
        assert "createdAt" in exercise_dict
        assert "confidenceScore" in exercise_dict
        
        # Convert back to Exercise
        exercise_from_dict = Exercise(**exercise_dict)
        assert exercise_from_dict.id == exercise.id
        assert exercise_from_dict.title == exercise.title 