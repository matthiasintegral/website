from unittest.mock import patch
import io

class TestAPIEndpoints:
    """Test cases for FastAPI endpoints"""
    
    def test_root_endpoint(self, client):
        """Test the root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Math Exercises API"
        assert data["version"] == "1.0.0"
    
    def test_health_check(self, client):
        """Test the health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_get_categories(self, client):
        """Test getting all available categories"""
        response = client.get("/api/exercises/categories")
        assert response.status_code == 200
        categories = response.json()
        
        expected_categories = [
            "Algebra", "Geometry", "Calculus", "Statistics", 
            "Number Theory", "Trigonometry", "Linear Algebra", 
            "Differential Equations"
        ]
        assert set(categories) == set(expected_categories)
    
    def test_create_exercise(self, client, sample_exercise_data):
        """Test creating a new exercise"""
        response = client.post("/api/exercises", json=sample_exercise_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["title"] == sample_exercise_data["title"]
        assert data["statement"] == sample_exercise_data["statement"]
        assert data["solution"] == sample_exercise_data["solution"]
        assert data["category"] == sample_exercise_data["category"]
        assert data["id"] is not None
        assert data["level"] == "advanced"
        assert data["status"] == "finished"
        assert data["createdAt"] is not None
        assert data["confidenceScore"] == 1.0
    
    def test_create_exercise_invalid_data(self, client):
        """Test creating exercise with invalid data"""
        invalid_data = {
            "title": "",  # Empty title
            "statement": "Test statement",
            "solution": "Test solution",
            "category": "Algebra"
        }
        
        response = client.post("/api/exercises", json=invalid_data)
        assert response.status_code == 422
    
    def test_get_exercises_empty(self, client):
        """Test getting exercises when none exist"""
        response = client.get("/api/exercises")
        assert response.status_code == 200
        
        data = response.json()
        assert data["exercises"] == []
        assert data["total"] == 0
        assert data["page"] == 1
        assert data["size"] == 0
    
    def test_get_exercises_with_data(self, client, sample_exercise_data):
        """Test getting exercises when some exist"""
        # Create an exercise first
        client.post("/api/exercises", json=sample_exercise_data)
        
        response = client.get("/api/exercises")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["exercises"]) == 1
        assert data["total"] == 1
        assert data["exercises"][0]["title"] == sample_exercise_data["title"]
    
    def test_get_exercises_with_filtering(self, client, sample_exercise_data):
        """Test getting exercises with title and category filtering"""
        # Create an exercise
        client.post("/api/exercises", json=sample_exercise_data)
        
        # Test title filtering
        response = client.get("/api/exercises?title=Quadratic")
        assert response.status_code == 200
        data = response.json()
        assert len(data["exercises"]) == 1
        
        # Test category filtering
        response = client.get("/api/exercises?category=Algebra")
        assert response.status_code == 200
        data = response.json()
        assert len(data["exercises"]) == 1
        
        # Test non-matching filter
        response = client.get("/api/exercises?title=Geometry")
        assert response.status_code == 200
        data = response.json()
        assert len(data["exercises"]) == 0
    
    def test_get_exercise_by_id(self, client, sample_exercise_data):
        """Test getting a specific exercise by ID"""
        # Create an exercise
        create_response = client.post("/api/exercises", json=sample_exercise_data)
        exercise_id = create_response.json()["id"]
        
        # Get the exercise
        response = client.get(f"/api/exercises/{exercise_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == exercise_id
        assert data["title"] == sample_exercise_data["title"]
    
    def test_get_nonexistent_exercise(self, client):
        """Test getting a non-existent exercise"""
        response = client.get("/api/exercises/nonexistent_id")
        assert response.status_code == 404
        assert response.json()["detail"] == "Exercise not found"
    
    def test_update_exercise(self, client, sample_exercise_data):
        """Test updating an existing exercise"""
        # Create an exercise
        create_response = client.post("/api/exercises", json=sample_exercise_data)
        exercise_id = create_response.json()["id"]
        
        # Update data
        update_data = {
            "title": "Updated Quadratic Equation",
            "statement": "Solve the updated equation: $x^2 - 6x + 8 = 0$"
        }
        
        response = client.put(f"/api/exercises/{exercise_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["statement"] == update_data["statement"]
        # Unchanged fields should remain the same
        assert data["solution"] == sample_exercise_data["solution"]
        assert data["category"] == sample_exercise_data["category"]
    
    def test_update_nonexistent_exercise(self, client):
        """Test updating a non-existent exercise"""
        update_data = {"title": "Updated Title"}
        response = client.put("/api/exercises/nonexistent_id", json=update_data)
        assert response.status_code == 404
        assert response.json()["detail"] == "Exercise not found"
    
    def test_delete_exercise(self, client, sample_exercise_data):
        """Test deleting an exercise"""
        # Create an exercise
        create_response = client.post("/api/exercises", json=sample_exercise_data)
        exercise_id = create_response.json()["id"]
        
        # Delete the exercise
        response = client.delete(f"/api/exercises/{exercise_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Exercise deleted successfully"
        
        # Verify it's gone
        get_response = client.get(f"/api/exercises/{exercise_id}")
        assert get_response.status_code == 404
    
    def test_delete_nonexistent_exercise(self, client):
        """Test deleting a non-existent exercise"""
        response = client.delete("/api/exercises/nonexistent_id")
        assert response.status_code == 404
        assert response.json()["detail"] == "Exercise not found"
    
    def test_get_exercise_stats(self, client, sample_exercise_data):
        """Test getting exercise statistics"""
        # Create an exercise
        client.post("/api/exercises", json=sample_exercise_data)
        
        response = client.get("/api/exercises/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert data["total_exercises"] == 1
        assert "Algebra" in data["category_distribution"]
        assert data["category_distribution"]["Algebra"] == 1
    
    @patch('services.ai_service.AIService.process_images')
    def test_ai_conversion_success(self, mock_process, client):
        """Test successful AI image conversion"""
        # Mock AI service response
        mock_process.return_value = (
            {
                "title": "AI Generated Exercise",
                "statement": "AI generated statement",
                "solution": "AI generated solution",
                "category": "Algebra"
            },
            0.95
        )
        
        # Create mock image files
        files = [
            ("files", ("test1.jpg", io.BytesIO(b"fake_image_1"), "image/jpeg")),
            ("files", ("test2.jpg", io.BytesIO(b"fake_image_2"), "image/jpeg"))
        ]
        
        response = client.post("/api/exercises/ai-conversion", files=files)
        assert response.status_code == 200
        
        data = response.json()
        assert data["title"] == "AI Generated Exercise"
        assert data["statement"] == "AI generated statement"
        assert data["solution"] == "AI generated solution"
        assert data["category"] == "Algebra"
        assert data["confidenceScore"] == 0.95
        assert data["message"] == "AI conversion completed successfully"
    
    def test_ai_conversion_no_files(self, client):
        """Test AI conversion with no files"""
        response = client.post("/api/exercises/ai-conversion", files=[])
        assert response.status_code == 400
        assert response.json()["detail"] == "No files uploaded"
    
    @patch('services.ai_service.AIService.validate_image')
    def test_ai_conversion_invalid_file(self, mock_validate, client):
        """Test AI conversion with invalid image file"""
        mock_validate.return_value = False
        
        files = [("files", ("invalid.txt", io.BytesIO(b"not_an_image"), "text/plain"))]
        
        response = client.post("/api/exercises/ai-conversion", files=files)
        assert response.status_code == 400
        assert "Invalid image file" in response.json()["detail"]
    
    @patch('services.ai_service.AIService.process_images')
    def test_ai_conversion_incomplete_data(self, mock_process, client):
        """Test AI conversion that returns incomplete data"""
        # Mock AI service returning incomplete data
        mock_process.return_value = (
            {
                "title": "Incomplete Exercise",
                # Missing statement and solution
            },
            0.8
        )
        
        files = [("files", ("test.jpg", io.BytesIO(b"fake_image"), "image/jpeg"))]
        
        response = client.post("/api/exercises/ai-conversion", files=files)
        assert response.status_code == 422
        assert "AI processing failed" in response.json()["detail"] 