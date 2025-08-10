# Math Exercise Analyzer with Multi-Image Support

A LangGraph-based agent for analyzing handwritten mathematical exercises from multiple images. This agent can process exercises that span multiple pages and intelligently combine the analysis into a single coherent exercise.

## Features

- **Multi-Image Support**: Process exercises that span multiple pages/images
- **Intelligent Combination**: Automatically combines analyses from multiple images into a unified exercise
- **LangGraph Workflow**: Uses LangGraph for robust state management and workflow orchestration
- **Vision AI**: Leverages OpenAI's GPT-4 Vision for accurate mathematical content extraction
- **Backward Compatibility**: Still supports single image analysis

## Installation

1. Install the required dependencies:
```bash
pip install langgraph langchain-openai python-dotenv
```

2. Set up your OpenAI API key:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

## Usage

### Basic Usage

```python
from math_agent_v0 import MathExerciseAnalyzer

# Initialize the analyzer
analyzer = MathExerciseAnalyzer(model_name="gpt-4o", temperature=0.0)

# Analyze a single image
exercise = analyzer.analyze_single_image("path/to/image.jpg")

# Analyze multiple images for the same exercise
exercise = analyzer.analyze_exercise([
    "path/to/page1.jpg",
    "path/to/page2.jpg",
    "path/to/page3.jpg"
])
```

### Example Output

```python
print(f"Statement: {exercise.statement}")
print(f"Response: {exercise.response}")
print(f"Domain: {exercise.domain}")
print(f"Level: {exercise.level}")
print(f"Confidence: {exercise.confidence_score}")
print(f"Image paths: {exercise.image_paths}")
```

## Workflow

The agent uses a LangGraph workflow with the following nodes:

1. **encode_images**: Converts all images to base64 format
2. **analyze_current_image**: Analyzes the current image using GPT-4 Vision
3. **structure_current_analysis**: Structures the raw analysis into JSON format
4. **check_more_images**: Determines if more images need processing
5. **combine_analyses**: Intelligently combines analyses from multiple images
6. **validate_results**: Creates the final MathExercise object

### Workflow Flow

```
encode_images → analyze_current_image → structure_current_analysis → check_more_images
                                                                    ↓
                                                              (more images?)
                                                                    ↓
                                                              Yes → analyze_current_image
                                                                    ↓
                                                              No → combine_analyses → validate_results → END
```

## Multi-Image Processing

The agent handles multi-image exercises by:

1. **Sequential Processing**: Analyzes each image individually
2. **Continuation Detection**: Identifies if an image is a continuation from a previous page
3. **Intelligent Combination**: Combines problem statements and solutions across multiple pages
4. **Confidence Aggregation**: Calculates overall confidence based on all analyses

### Combination Logic

- **Problem Statement**: Uses the statement from the first page (typically contains the problem)
- **Solution**: Combines solutions from all pages into a complete response
- **Domain & Level**: Uses the most confident analysis for mathematical domain and difficulty level
- **Overall Confidence**: Calculated based on the quality and consistency of all analyses

## Data Structures

### MathExercise

```python
@dataclass
class MathExercise:
    statement: str              # The mathematical problem statement
    response: str              # The complete solution/answer
    domain: str               # Mathematical domain (Algebra, Calculus, etc.)
    level: str                # Difficulty level (Elementary, High School, etc.)
    confidence_score: float   # Confidence in the analysis (0-1)
    image_paths: List[str]    # List of all image paths used in analysis
```

### AnalysisState

```python
class AnalysisState(TypedDict):
    image_paths: List[str]                    # Input image paths
    base64_images: List[str]                  # Encoded images
    raw_analyses: List[str]                   # Raw analysis from each image
    structured_analyses: List[Dict[str, Any]] # Structured analysis from each image
    combined_analysis: Optional[Dict[str, Any]] # Final combined analysis
    exercise: Optional[MathExercise]          # Final exercise object
    error: Optional[str]                      # Error message if any
    current_image_index: int                 # Current image being processed
```

## Error Handling

The agent includes comprehensive error handling:

- **Image Loading Errors**: Handles missing or corrupted image files
- **API Errors**: Manages OpenAI API failures and rate limits
- **Parsing Errors**: Handles malformed analysis results
- **Validation Errors**: Ensures all required fields are present

## Examples

See `example_usage.py` for complete examples demonstrating:

1. Single image analysis
2. Multi-image analysis
3. Variable number of images
4. Workflow demonstration

## Configuration

### Model Configuration

```python
analyzer = MathExerciseAnalyzer(
    model_name="gpt-4o",      # OpenAI model to use
    temperature=0.0           # Temperature for deterministic results
)
```

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Limitations

- Requires OpenAI API access with GPT-4 Vision capability
- Image quality affects analysis accuracy
- Handwritten text must be reasonably legible
- Mathematical notation should be clear and well-formed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 