import pytest
from unittest.mock import patch, MagicMock

# Mock the math_agent_v0 import since it might not be available in test environment
with patch.dict('sys.modules', {'agent.math_agent_v0': MagicMock()}):
    from agent.backend.services.ai_service import AIService

class TestAIService:
    """Test cases for AIService"""
    
    def test_init_with_available_analyzer(self):
        """Test initialization when MathExerciseAnalyzer is available"""
        with patch('agent.backend.services.ai_service.MathExerciseAnalyzer') as mock_analyzer_class:
            mock_analyzer = MagicMock()
            mock_analyzer_class.return_value = mock_analyzer
            
            service = AIService()
            
            assert service.analyzer is not None
            mock_analyzer_class.assert_called_once()
    
    def test_init_with_unavailable_analyzer(self):
        """Test initialization when MathExerciseAnalyzer is not available"""
        with patch('agent.backend.services.ai_service.MathExerciseAnalyzer', side_effect=ImportError("Module not found")):
            service = AIService()
            
            assert service.analyzer is None
    
    @patch('agent.backend.services.ai_service.MathExerciseAnalyzer')
    def test_process_images_success(self, mock_analyzer_class):
        """Test successful image processing"""
        # Mock the analyzer
        mock_analyzer = MagicMock()
        mock_analyzer_class.return_value = mock_analyzer
        
        # Mock the analyze_exercise method
        mock_exercise = MagicMock()
        mock_exercise.title = "Test Exercise"
        mock_exercise.statement = "Test statement"
        mock_exercise.response = "Test solution"
        mock_exercise.domain = "Algebra"
        mock_exercise.confidence_score = 0.95
        
        mock_analyzer.analyze_exercise.return_value = mock_exercise
        
        service = AIService()
        
        # Create mock image files
        mock_file1 = MagicMock()
        mock_file1.file.read.return_value = b"fake_image_1"
        mock_file1.filename = "test1.jpg"
        
        mock_file2 = MagicMock()
        mock_file2.file.read.return_value = b"fake_image_2"
        mock_file2.filename = "test2.jpg"
        
        files = [mock_file1, mock_file2]
        filenames = ["test1.jpg", "test2.jpg"]
        
        # Process images
        exercise_data, confidence_score = service.process_images(files, filenames)
        
        # Verify results
        assert exercise_data["title"] == "Test Exercise"
        assert exercise_data["statement"] == "Test statement"
        assert exercise_data["solution"] == "Test solution"
        assert exercise_data["category"] == "Algebra"
        assert exercise_data["confidenceScore"] == 0.95
        assert confidence_score == 0.95
        
        # Verify analyzer was called
        mock_analyzer.analyze_exercise.assert_called_once()
    
    def test_process_images_no_analyzer(self):
        """Test image processing when analyzer is not available"""
        service = AIService()
        service.analyzer = None
        
        mock_file = MagicMock()
        mock_file.filename = "test.jpg"
        
        with pytest.raises(Exception, match="AI service not properly initialized"):
            service.process_images([mock_file], ["test.jpg"])
    
    @patch('agent.backend.services.ai_service.MathExerciseAnalyzer')
    def test_process_single_image(self, mock_analyzer_class):
        """Test processing a single image"""
        # Mock the analyzer
        mock_analyzer = MagicMock()
        mock_analyzer_class.return_value = mock_analyzer
        
        mock_exercise = MagicMock()
        mock_exercise.title = "Single Exercise"
        mock_exercise.statement = "Single statement"
        mock_exercise.response = "Single solution"
        mock_exercise.domain = "Geometry"
        mock_exercise.confidence_score = 0.88
        
        mock_analyzer.analyze_exercise.return_value = mock_exercise
        
        service = AIService()
        
        mock_file = MagicMock()
        mock_file.file.read.return_value = b"single_image"
        mock_file.filename = "single.jpg"
        
        exercise_data, confidence_score = service.process_single_image(mock_file, "single.jpg")
        
        assert exercise_data["title"] == "Single Exercise"
        assert exercise_data["statement"] == "Single statement"
        assert exercise_data["solution"] == "Single solution"
        assert exercise_data["category"] == "Geometry"
        assert confidence_score == 0.88
    
    def test_validate_image_valid_jpg(self):
        """Test validation of valid JPG image"""
        service = AIService()
        
        # Create a mock file with valid JPG content
        mock_file = MagicMock()
        mock_file.filename = "valid.jpg"
        
        # Mock PIL Image.open to return a valid image
        with patch('PIL.Image.open') as mock_pil_open:
            mock_image = MagicMock()
            mock_image.verify.return_value = None
            mock_pil_open.return_value = mock_image
            
            result = service.validate_image(mock_file, "valid.jpg")
            assert result is True
    
    def test_validate_image_invalid_extension(self):
        """Test validation of file with invalid extension"""
        service = AIService()
        
        mock_file = MagicMock()
        mock_file.filename = "document.txt"
        
        result = service.validate_image(mock_file, "document.txt")
        assert result is False
    
    def test_validate_image_invalid_image(self):
        """Test validation of invalid image file"""
        service = AIService()
        
        mock_file = MagicMock()
        mock_file.filename = "invalid.jpg"
        
        # Mock PIL Image.open to raise an exception
        with patch('PIL.Image.open', side_effect=Exception("Invalid image")):
            result = service.validate_image(mock_file, "invalid.jpg")
            assert result is False
    
    def test_get_health_status_healthy(self):
        """Test health status when analyzer is available"""
        with patch('agent.backend.services.ai_service.MathExerciseAnalyzer') as mock_analyzer_class:
            mock_analyzer = MagicMock()
            mock_analyzer_class.return_value = mock_analyzer
            
            service = AIService()
            health = service.get_health_status()
            
            assert health["status"] == "healthy"
            assert health["analyzer_available"] is True
            assert health["service"] == "AI Math Exercise Analyzer"
    
    def test_get_health_status_unhealthy(self):
        """Test health status when analyzer is not available"""
        service = AIService()
        service.analyzer = None
        
        health = service.get_health_status()
        
        assert health["status"] == "unhealthy"
        assert health["analyzer_available"] is False
        assert health["service"] == "AI Math Exercise Analyzer"
    
    @patch('agent.backend.services.ai_service.MathExerciseAnalyzer')
    def test_process_images_cleanup_temp_files(self, mock_analyzer_class):
        """Test that temporary files are cleaned up after processing"""
        # Mock the analyzer
        mock_analyzer = MagicMock()
        mock_analyzer_class.return_value = mock_analyzer
        
        mock_exercise = MagicMock()
        mock_exercise.title = "Cleanup Test"
        mock_exercise.statement = "Test"
        mock_exercise.response = "Test"
        mock_exercise.domain = "Algebra"
        mock_exercise.confidence_score = 0.9
        
        mock_analyzer.analyze_exercise.return_value = mock_exercise
        
        service = AIService()
        
        mock_file = MagicMock()
        mock_file.file.read.return_value = b"test_image"
        mock_file.filename = "test.jpg"
        
        # Mock tempfile.NamedTemporaryFile
        with patch('tempfile.NamedTemporaryFile') as mock_temp_file:
            mock_temp = MagicMock()
            mock_temp.name = "/tmp/test_temp_file"
            mock_temp_file.return_value = mock_temp
            
            # Mock os.unlink for cleanup verification
            with patch('os.unlink') as mock_unlink:
                service.process_images([mock_file], ["test.jpg"])
                
                # Verify cleanup was attempted
                mock_unlink.assert_called()
    
    def test_validate_image_allowed_extensions(self):
        """Test that all allowed image extensions are accepted"""
        service = AIService()
        
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
        
        for ext in allowed_extensions:
            mock_file = MagicMock()
            mock_file.filename = f"test{ext}"
            
            with patch('PIL.Image.open') as mock_pil_open:
                mock_image = MagicMock()
                mock_image.verify.return_value = None
                mock_pil_open.return_value = mock_image
                
                result = service.validate_image(mock_file, f"test{ext}")
                assert result is True, f"Extension {ext} should be allowed" 