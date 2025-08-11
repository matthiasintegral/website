#!/usr/bin/env python3
"""
Demonstration script showing how to use the mocked exercise with the Math Exercises API
This script creates a test exercise and demonstrates the API endpoints
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

def print_separator(title):
    """Print a formatted separator"""
    print(f"\n{'='*60}")
    print(f" {title}")
    print(f"{'='*60}")

def print_response(response, title):
    """Print formatted API response"""
    print(f"\n📡 {title}")
    print(f"Status: {response.status_code}")
    if response.status_code < 400:
        try:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        except:
            print(f"Response: {response.text}")
    else:
        print(f"Error: {response.text}")

def demo_api_endpoints():
    """Demonstrate the API endpoints with the mocked exercise"""
    
    # Sample exercise data (the mocked exercise)
    sample_exercise = {
        "title": "Test Quadratic Equation",
        "statement": "Solve the quadratic equation: $x^2 - 5x + 6 = 0$",
        "solution": "Step 1: Factor the expression\n$x^2 - 5x + 6 = (x - 2)(x - 3)$\n\nStep 2: Set factors equal to zero\n$x - 2 = 0$ or $x - 4 = 0$\n\nStep 3: Solve for x\n$x = 2$ or $x = 3$",
        "category": "Algebra"
    }
    
    print_separator("Math Exercises API Demo")
    print("This demo shows how to use the API with a mocked exercise")
    print(f"Exercise: {sample_exercise['title']}")
    
    # 1. Check API health
    print_separator("1. API Health Check")
    response = requests.get(f"{BASE_URL}/health")
    print_response(response, "Health Check")
    
    # 2. Get available categories
    print_separator("2. Get Available Categories")
    response = requests.get(f"{BASE_URL}/api/exercises/categories")
    print_response(response, "Categories")
    
    # 3. Create the exercise
    print_separator("3. Create Exercise")
    response = requests.post(f"{BASE_URL}/api/exercises", json=sample_exercise)
    print_response(response, "Create Exercise")
    
    if response.status_code == 201:
        exercise_data = response.json()
        exercise_id = exercise_data["id"]
        print(f"✅ Exercise created with ID: {exercise_id}")
        
        # 4. Get all exercises
        print_separator("4. Get All Exercises")
        response = requests.get(f"{BASE_URL}/api/exercises")
        print_response(response, "All Exercises")
        
        # 5. Get the specific exercise by ID
        print_separator("5. Get Exercise by ID")
        response = requests.get(f"{BASE_URL}/api/exercises/{exercise_id}")
        print_response(response, f"Exercise {exercise_id}")
        
        # 6. Search exercises by title
        print_separator("6. Search Exercises by Title")
        response = requests.get(f"{BASE_URL}/api/exercises?title=Quadratic")
        print_response(response, "Search by Title 'Quadratic'")
        
        # 7. Search exercises by category
        print_separator("7. Search Exercises by Category")
        response = requests.get(f"{BASE_URL}/api/exercises?category=Algebra")
        print_response(response, "Search by Category 'Algebra'")
        
        # 8. Update the exercise
        print_separator("8. Update Exercise")
        update_data = {
            "title": "Updated Quadratic Equation",
            "statement": "Solve the updated equation: $x^2 - 6x + 8 = 0$"
        }
        response = requests.put(f"{BASE_URL}/api/exercises/{exercise_id}", json=update_data)
        print_response(response, "Update Exercise")
        
        # 9. Get exercise statistics
        print_separator("9. Get Exercise Statistics")
        response = requests.get(f"{BASE_URL}/api/exercises/stats")
        print_response(response, "Exercise Statistics")
        
        # 10. Delete the exercise
        print_separator("10. Delete Exercise")
        response = requests.delete(f"{BASE_URL}/api/exercises/{exercise_id}")
        print_response(response, "Delete Exercise")
        
        # 11. Verify deletion
        print_separator("11. Verify Deletion")
        response = requests.get(f"{BASE_URL}/api/exercises/{exercise_id}")
        print_response(response, "Verify Exercise Deleted")
        
        # 12. Final state
        print_separator("12. Final State")
        response = requests.get(f"{BASE_URL}/api/exercises")
        print_response(response, "Final Exercise Count")
        
    else:
        print("❌ Failed to create exercise. Cannot continue demo.")
        return False
    
    return True

def demo_error_handling():
    """Demonstrate error handling scenarios"""
    
    print_separator("Error Handling Demo")
    
    # 1. Try to get non-existent exercise
    print("\n🔍 1. Get Non-existent Exercise")
    response = requests.get(f"{BASE_URL}/api/exercises/nonexistent_id")
    print_response(response, "Get Non-existent Exercise")
    
    # 2. Try to create exercise with invalid data
    print("\n🔍 2. Create Exercise with Invalid Data")
    invalid_exercise = {
        "title": "",  # Empty title
        "statement": "Test statement",
        "solution": "Test solution",
        "category": "InvalidCategory"  # Invalid category
    }
    response = requests.post(f"{BASE_URL}/api/exercises", json=invalid_exercise)
    print_response(response, "Create Invalid Exercise")
    
    # 3. Try to update non-existent exercise
    print("\n🔍 3. Update Non-existent Exercise")
    update_data = {"title": "Updated Title"}
    response = requests.put(f"{BASE_URL}/api/exercises/nonexistent_id", json=update_data)
    print_response(response, "Update Non-existent Exercise")
    
    # 4. Try to delete non-existent exercise
    print("\n🔍 4. Delete Non-existent Exercise")
    response = requests.delete(f"{BASE_URL}/api/exercises/nonexistent_id")
    print_response(response, "Delete Non-existent Exercise")

def main():
    """Main demo function"""
    print("🚀 Starting Math Exercises API Demo")
    print(f"🌐 API Base URL: {BASE_URL}")
    
    try:
        # Check if API is running
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print("❌ API is not responding. Please start the backend server first.")
            print("Run: cd agent/backend && python main.py")
            return
        
        print("✅ API is running and responding")
        
        # Run the main demo
        if demo_api_endpoints():
            print("\n🎉 Demo completed successfully!")
            
            # Run error handling demo
            demo_error_handling()
            
        print("\n✨ Demo finished!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Please start the backend server first.")
        print("Run: cd agent/backend && python main.py")
    except Exception as e:
        print(f"❌ Demo failed with error: {e}")

if __name__ == "__main__":
    main() 