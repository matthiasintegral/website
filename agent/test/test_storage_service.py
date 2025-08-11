from pathlib import Path
from agent.backend.services.storage_service import FileStorageService
from agent.backend.models import ExerciseCreate, ExerciseUpdate, Category

class TestFileStorageService:
    """Test cases for FileStorageService"""
    
    def test_init_creates_directories(self, temp_data_dir):
        """Test that service creates necessary directories on initialization"""
        service = FileStorageService(data_dir=temp_data_dir)
        
        assert (Path(temp_data_dir) / "exercises").exists()
        assert (Path(temp_data_dir) / "images").exists()
    
    def test_create_exercise(self, storage_service, sample_exercise_create):
        """Test creating a new exercise"""
        exercise = storage_service.create_exercise(sample_exercise_create, confidence_score=1.0)
        
        assert exercise.id is not None
        assert exercise.title == sample_exercise_create.title
        assert exercise.statement == sample_exercise_create.statement
        assert exercise.solution == sample_exercise_create.solution
        assert exercise.category == sample_exercise_create.category
        assert exercise.level == "advanced"
        assert exercise.status == "finished"
        assert exercise.createdAt is not None
        assert exercise.confidenceScore == 1.0
        
        # Check file was created
        exercise_file = Path(storage_service.data_dir) / "exercises" / f"{exercise.id}.json"
        assert exercise_file.exists()
    
    def test_create_exercise_with_duplicate_title(self, storage_service, sample_exercise_create):
        """Test that duplicate titles get suffixes added"""
        # Create first exercise
        exercise1 = storage_service.create_exercise(sample_exercise_create)
        
        # Create second exercise with same title
        exercise2 = storage_service.create_exercise(sample_exercise_create)
        
        assert exercise1.title == sample_exercise_create.title
        assert exercise2.title == f"{sample_exercise_create.title} (1)"
        assert exercise1.id != exercise2.id
    
    def test_get_exercise(self, storage_service, sample_exercise_create):
        """Test retrieving an exercise by ID"""
        created_exercise = storage_service.create_exercise(sample_exercise_create)
        retrieved_exercise = storage_service.get_exercise(created_exercise.id)
        
        assert retrieved_exercise is not None
        assert retrieved_exercise.id == created_exercise.id
        assert retrieved_exercise.title == created_exercise.title
    
    def test_get_nonexistent_exercise(self, storage_service):
        """Test retrieving a non-existent exercise returns None"""
        exercise = storage_service.get_exercise("nonexistent_id")
        assert exercise is None
    
    def test_get_all_exercises(self, storage_service, sample_exercise_create):
        """Test retrieving all exercises"""
        # Create multiple exercises
        exercise1 = storage_service.create_exercise(sample_exercise_create)
        
        # Create second exercise with different data
        exercise2_data = ExerciseCreate(
            title="Test Geometry Problem",
            statement="Find the area of a circle with radius 5",
            solution="Area = πr² = π(5)² = 25π",
            category=Category.GEOMETRY
        )
        exercise2 = storage_service.create_exercise(exercise2_data)
        
        all_exercises = storage_service.get_all_exercises()
        
        assert len(all_exercises) == 2
        exercise_ids = [ex.id for ex in all_exercises]
        assert exercise1.id in exercise_ids
        assert exercise2.id in exercise_ids
    
    def test_search_exercises_by_title(self, storage_service, sample_exercise_create):
        """Test searching exercises by title"""
        exercise = storage_service.create_exercise(sample_exercise_create)
        
        # Search by partial title
        results = storage_service.search_exercises(title="Quadratic")
        assert len(results) == 1
        assert results[0].id == exercise.id
        
        # Search by non-matching title
        results = storage_service.search_exercises(title="Geometry")
        assert len(results) == 0
    
    def test_search_exercises_by_category(self, storage_service, sample_exercise_create):
        """Test searching exercises by category"""
        exercise = storage_service.create_exercise(sample_exercise_create)
        
        # Search by matching category
        results = storage_service.search_exercises(category="Algebra")
        assert len(results) == 1
        assert results[0].id == exercise.id
        
        # Search by non-matching category
        results = storage_service.search_exercises(category="Geometry")
        assert len(results) == 0
    
    def test_search_exercises_by_title_and_category(self, storage_service, sample_exercise_create):
        """Test searching exercises by both title and category"""
        exercise = storage_service.create_exercise(sample_exercise_create)
        
        # Search by both matching criteria
        results = storage_service.search_exercises(title="Quadratic", category="Algebra")
        assert len(results) == 1
        assert results[0].id == exercise.id
        
        # Search by title match but category mismatch
        results = storage_service.search_exercises(title="Quadratic", category="Geometry")
        assert len(results) == 0
    
    def test_update_exercise(self, storage_service, sample_exercise_create, sample_exercise_update):
        """Test updating an existing exercise"""
        exercise = storage_service.create_exercise(sample_exercise_create)
        
        update_data = ExerciseUpdate(**sample_exercise_update)
        updated_exercise = storage_service.update_exercise(exercise.id, update_data)
        
        assert updated_exercise is not None
        assert updated_exercise.title == sample_exercise_update["title"]
        assert updated_exercise.statement == sample_exercise_update["statement"]
        # Unchanged fields should remain the same
        assert updated_exercise.solution == exercise.solution
        assert updated_exercise.category == exercise.category
    
    def test_update_nonexistent_exercise(self, storage_service, sample_exercise_update):
        """Test updating a non-existent exercise returns None"""
        update_data = ExerciseUpdate(**sample_exercise_update)
        result = storage_service.update_exercise("nonexistent_id", update_data)
        assert result is None
    
    def test_delete_exercise(self, storage_service, sample_exercise_create):
        """Test deleting an exercise"""
        exercise = storage_service.create_exercise(sample_exercise_create)
        
        # Verify exercise exists
        assert storage_service.get_exercise(exercise.id) is not None
        
        # Delete exercise
        success = storage_service.delete_exercise(exercise.id)
        assert success is True
        
        # Verify exercise is gone
        assert storage_service.get_exercise(exercise.id) is None
    
    def test_delete_nonexistent_exercise(self, storage_service):
        """Test deleting a non-existent exercise returns False"""
        success = storage_service.delete_exercise("nonexistent_id")
        assert success is False
    
    def test_get_exercise_count(self, storage_service, sample_exercise_create):
        """Test getting the total exercise count"""
        initial_count = storage_service.get_exercise_count()
        assert initial_count == 0
        
        # Create exercises
        storage_service.create_exercise(sample_exercise_create)
        storage_service.create_exercise(sample_exercise_create)
        
        final_count = storage_service.get_exercise_count()
        assert final_count == 2
    
    def test_save_image(self, storage_service, sample_exercise_create):
        """Test saving an image for an exercise"""
        exercise = storage_service.create_exercise(sample_exercise_create)
        
        # Mock file object
        class MockFile:
            def __init__(self, content):
                self.content = content
                self.file = type('MockFileReader', (), {'read': lambda self: content})()
        
        mock_file = MockFile(b"fake_image_content")
        filename = "test_image.jpg"
        
        image_path = storage_service.save_image(exercise.id, mock_file, filename)
        
        # Check path format
        assert image_path.startswith(f"images/{exercise.id}/")
        assert image_path.endswith(".jpg")
        
        # Check file was actually saved
        full_path = Path(storage_service.data_dir) / image_path
        assert full_path.exists()
        assert full_path.read_bytes() == b"fake_image_content" 