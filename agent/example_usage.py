#!/usr/bin/env python3
"""
Example usage of the MathExerciseAnalyzer with multi-image support
"""

import os
from math_agent_v0 import MathExerciseAnalyzer

def main():
    # Initialize the analyzer
    analyzer = MathExerciseAnalyzer(model_name="gpt-4o", temperature=0.0)
    
    # Example 1: Analyze a single image (backward compatibility)
    print("=== Example 1: Single Image Analysis ===")
    try:
        # Using the convenience method for single images
        single_image_path = "/home/elbaz/Bureau/website/agent/images/exo_1/IMG_4698.jpg"
        if os.path.exists(single_image_path):
            exercise = analyzer.analyze_single_image(single_image_path)
            print(f"Statement: {exercise.statement}")
            print(f"Response: {exercise.response}")
            print(f"Domain: {exercise.domain}")
            print(f"Level: {exercise.level}")
            print(f"Confidence: {exercise.confidence_score}")
            print(f"Image paths: {exercise.image_paths}")
            print()
        else:
            print(f"Image file not found: {single_image_path}")
    except Exception as e:
        print(f"Error analyzing single image: {e}")
    
    # Example 2: Analyze multiple images for the same exercise
    print("=== Example 2: Multi-Image Analysis ===")
    try:
        # List of images for the same exercise (multiple pages)
        multi_image_paths = [
            "/home/elbaz/Bureau/website/agent/images/exo_1/IMG_4698.jpg",
            "/home/elbaz/Bureau/website/agent/images/exo_1/IMG_4699.jpg"
        ]
        
        # Check if all images exist
        existing_paths = [path for path in multi_image_paths if os.path.exists(path)]
        
        if len(existing_paths) > 0:
            exercise = analyzer.analyze_exercise(existing_paths)
            print(f"Statement: {exercise.statement}")
            print(f"Response: {exercise.response}")
            print(f"Domain: {exercise.domain}")
            print(f"Level: {exercise.level}")
            print(f"Confidence: {exercise.confidence_score}")
            print(f"Number of images processed: {len(exercise.image_paths)}")
            print(f"Image paths: {exercise.image_paths}")
            print()
        else:
            print("No image files found for multi-image analysis")
    except Exception as e:
        print(f"Error analyzing multiple images: {e}")

def demonstrate_workflow():
    """Demonstrate the internal workflow steps"""
    print("=== Workflow Demonstration ===")
    
    analyzer = MathExerciseAnalyzer()
    
    # Show the workflow structure
    print("Workflow nodes:")
    for node_name in analyzer.workflow.nodes:
        print(f"  - {node_name}")
    
    print("\nWorkflow edges:")
    # This would require accessing the graph structure
    print("  - encode_images → analyze_current_image")
    print("  - analyze_current_image → structure_current_analysis")
    print("  - structure_current_analysis → check_more_images")
    print("  - check_more_images → analyze_current_image (if more images)")
    print("  - check_more_images → combine_analyses (if all done)")
    print("  - combine_analyses → validate_results")
    print("  - validate_results → END")

    

if __name__ == "__main__":
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("Warning: OPENAI_API_KEY environment variable not set")
        print("Please set your OpenAI API key to use this example")
        print("export OPENAI_API_KEY='your-api-key-here'")
        exit(1)
    
    main()
    demonstrate_workflow() 