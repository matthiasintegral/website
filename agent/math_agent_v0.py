import os
from typing import Dict, Any, Optional, TypedDict, List
from dataclasses import dataclass
import base64

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class MathExercise:
    """Data class to represent a mathematical exercise"""
    title: str  # New field for exercise title
    statement: str
    response: str
    domain: str
    level: str
    confidence_score: float
    image_paths: List[str]  # Changed from single image_path to list of image_paths

class AnalysisState(TypedDict):
    """State for the analysis workflow"""
    image_paths: List[str]  # Changed from single image_path to list
    base64_images: List[str]  # Changed from single base64_image to list
    raw_analyses: List[str]  # Changed from single raw_analysis to list
    structured_analyses: List[Dict[str, Any]]  # Changed from single structured_analysis to list
    combined_analysis: Optional[Dict[str, Any]]  # New field for combined analysis
    exercise: Optional[MathExercise]
    error: Optional[str]
    current_image_index: int  # New field to track current image being processed

class MathExerciseAnalyzer:
    """Agent for analyzing handwritten mathematical exercises using LangGraph"""
    
    def __init__(self, model_name: str = "gpt-4o", temperature: float = 0.0):
        """
        Initialize the MathExerciseAnalyzer
        
        Args:
            model_name: OpenAI model to use for analysis
            temperature: Temperature for model responses
        """
        self.llm = ChatOpenAI(
            model=model_name,
            temperature=temperature,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Initialize memory saver for state management
        self.memory = MemorySaver()
        
        # Create the workflow graph
        self.workflow = self._create_workflow()
        
    def _create_workflow(self) -> StateGraph:
        """Create the LangGraph workflow for mathematical exercise analysis"""
        
        # Define the workflow nodes
        workflow = StateGraph(AnalysisState)
        
        # Add nodes
        workflow.add_node("encode_images", self._encode_images_node)
        workflow.add_node("analyze_current_image", self._analyze_current_image_node)
        workflow.add_node("structure_current_analysis", self._structure_current_analysis_node)
        workflow.add_node("check_more_images", self._check_more_images_node)
        workflow.add_node("combine_analyses", self._combine_analyses_node)
        workflow.add_node("validate_results", self._validate_results_node)
        
        # Define the workflow edges
        workflow.set_entry_point("encode_images")
        workflow.add_edge("encode_images", "analyze_current_image")
        workflow.add_edge("analyze_current_image", "structure_current_analysis")
        workflow.add_edge("structure_current_analysis", "check_more_images")
        workflow.add_conditional_edges(
            "check_more_images",
            self._route_after_check,
            {
                "continue": "analyze_current_image",
                "combine": "combine_analyses"
            }
        )
        workflow.add_edge("combine_analyses", "validate_results")
        workflow.add_edge("validate_results", END)
        
        return workflow.compile(checkpointer=self.memory)
    
    def _encode_images_node(self, state: AnalysisState) -> AnalysisState:
        """Encode all images to base64 for API transmission"""
        try:
            base64_images = []
            for image_path in state["image_paths"]:
                with open(image_path, "rb") as image_file:
                    base64_image = base64.b64encode(image_file.read()).decode('utf-8')
                    base64_images.append(base64_image)
            
            state["base64_images"] = base64_images
            state["current_image_index"] = 0
            state["raw_analyses"] = []
            state["structured_analyses"] = []
            
        except Exception as e:
            state["error"] = f"Failed to encode images: {str(e)}"
        
        return state
    
    def _analyze_current_image_node(self, state: AnalysisState) -> AnalysisState:
        """Analyze the current image using OpenAI vision capabilities"""
        if state["error"] is not None:
            return state
            
        current_index = state["current_image_index"]
        base64_image = state["base64_images"][current_index]
        
        system_prompt = """You are an expert mathematical exercise analyzer with OCR capabilities. Your task is to transcribe EXACTLY what you see in the handwritten mathematical exercise, converting mathematical notation to LaTeX format.

            Extract the following information:

            1. **Title**: A descriptive title for the exercise (e.g., "Solving Quadratic Equations", "Integration by Parts", "Geometry Problem with Circles")
            2. **Statement**: The mathematical problem or question being asked (transcribe exactly as written)
            3. **Response**: The handwritten solution or answer provided (transcribe exactly as written)
            4. **Domain**: The mathematical domain (Algebra, Calculus, Geometry, Trigonometry, Statistics, etc.)
            5. **Level**: The difficulty level (Elementary, Middle School, High School, College, Advanced)

            CRITICAL GUIDELINES:
            - **OCR-like Transcription**: Transcribe ONLY what is visible in the image, exactly as written
            - **LaTeX Integration**: Convert ALL mathematical notation to proper LaTeX format
            - **Preserve Original Content**: Do not add, remove, or modify mathematical content
            - **Maintain Structure**: Keep the original layout and flow of the exercise
            - **Confidence Assessment**: Provide confidence scores based on clarity of handwriting
            - **Page Continuity**: Note if this appears to be a continuation from a previous page

            Return your analysis in a clear, structured format with proper LaTeX notation."""

        try:
            message = HumanMessage(
                content=[
                    {
                        "type": "text",
                        "text": f"Please analyze this handwritten mathematical exercise (page {current_index + 1} of {len(state['base64_images'])}). Extract the statement, response, domain, and level."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            )
            
            response = self.llm.invoke([SystemMessage(content=system_prompt), message])
            state["raw_analyses"].append(response.content)
            
        except Exception as e:
            state["error"] = f"Failed to analyze image {current_index + 1}: {str(e)}"
        
        return state
    
    def _structure_current_analysis_node(self, state: AnalysisState) -> AnalysisState:
        """Structure the raw analysis of the current image into a structured format"""
        if state["error"] is not None or "raw_analyses" not in state:
            return state
            
        current_index = state["current_image_index"]
        raw_analysis = state["raw_analyses"][current_index]
        
        structure_prompt = """Extract the following information from the analysis and return it as JSON with proper LaTeX notation:

        {{
            "title": "descriptive title for the exercise",
            "statement": "extracted problem statement with LaTeX notation",
            "response": "extracted solution/answer with LaTeX notation", 
            "domain": "mathematical domain",
            "level": "difficulty level",
            "confidence_score": score between 0 and 1,
            "is_continuation": boolean indicating if this is a continuation from previous page
        }}

        IMPORTANT: Ensure all mathematical expressions use proper LaTeX syntax.
        Analysis text:
        {analysis}"""

        try:
            prompt = ChatPromptTemplate.from_template(structure_prompt)
            chain = prompt | self.llm | JsonOutputParser()
            
            structured = chain.invoke({"analysis": raw_analysis})
            state["structured_analyses"].append(structured)
            
        except Exception as e:
            state["error"] = f"Failed to structure analysis for image {current_index + 1}: {str(e)}"
        
        return state
    
    def _check_more_images_node(self, state: AnalysisState) -> AnalysisState:
        """Check if there are more images to process"""
        current_index = state["current_image_index"]
        total_images = len(state["image_paths"])
        
        if current_index + 1 < total_images:
            # Move to next image
            state["current_image_index"] = current_index + 1
        else:
            # All images processed, ready to combine
            pass
        
        return state
    
    def _route_after_check(self, state: AnalysisState) -> str:
        """Route to next step based on whether more images need processing"""
        current_index = state["current_image_index"]
        total_images = len(state["image_paths"])
        
        if current_index + 1 < total_images:
            return "continue"
        else:
            return "combine"
    
    def _combine_analyses_node(self, state: AnalysisState) -> AnalysisState:
        """Combine analyses from multiple images into a single coherent exercise"""
        if state["error"] is not None or "structured_analyses" not in state:
            return state
            
        try:
            analyses = state["structured_analyses"]
            
            if len(analyses) == 1:
                # Single image, use the analysis directly
                combined = analyses[0]
            else:
                # Multiple images, need to combine intelligently
                combine_prompt = """You are an expert at combining mathematical exercise analyses from multiple pages. 
                Given analyses from multiple pages of the same exercise, create a unified analysis with proper LaTeX notation.

                Guidelines:
                - If the first page contains the problem statement, use that for the title and statement
                - If subsequent pages contain solutions, combine them into a complete response
                - Maintain the mathematical domain and level from the most confident analysis
                - Calculate an overall confidence score based on all analyses
                - Ensure the final statement and response are coherent and complete
                - Preserve all LaTeX notation from individual analyses
                - Create a descriptive title that captures the essence of the exercise

                Return the combined analysis as JSON:
                {{
                    "title": "descriptive title for the complete exercise",
                    "statement": "combined problem statement with LaTeX notation",
                    "response": "combined complete solution/answer with LaTeX notation",
                    "domain": "mathematical domain",
                    "level": "difficulty level", 
                    "confidence_score": overall score between 0 and 1
                }}

                IMPORTANT: Maintain all LaTeX syntax and mathematical notation from the original analyses.
                Individual analyses:
                {analyses}"""

                prompt = ChatPromptTemplate.from_template(combine_prompt)
                chain = prompt | self.llm | JsonOutputParser()
                
                combined = chain.invoke({"analyses": analyses})
            
            state["combined_analysis"] = combined
            
        except Exception as e:
            state["error"] = f"Failed to combine analyses: {str(e)}"
        
        return state
    
    def _validate_results_node(self, state: AnalysisState) -> AnalysisState:
        """Validate and create the final MathExercise object"""
        if state["error"] is not None or "combined_analysis" not in state:
            return state
            
        try:
            analysis = state["combined_analysis"]
            
            # Validate required fields
            required_fields = ["title", "statement", "response", "domain", "level", "confidence_score"]
            for field in required_fields:
                if field not in analysis:
                    if field == "title":
                        # Generate a title from the statement if missing
                        analysis[field] = f"{analysis.get('domain', 'Math')} Exercise"
                    elif field == "confidence_score":
                        analysis[field] = 0.0
                    else:
                        analysis[field] = "Unknown"
            
            # Create MathExercise object with multiple image paths
            exercise = MathExercise(
                title=analysis["title"],
                statement=analysis["statement"],
                response=analysis["response"],
                domain=analysis["domain"],
                level=analysis["level"],
                confidence_score=analysis["confidence_score"],
                image_paths=state["image_paths"]  # Use the list of image paths
            )
            
            state["exercise"] = exercise
            
        except Exception as e:
            state["error"] = f"Failed to validate results: {str(e)}"
        
        return state
    
    def analyze_exercise(self, image_paths: List[str], thread_id: str = None) -> MathExercise:
        """
        Analyze a mathematical exercise from multiple images
        
        Args:
            image_paths: List of paths to images containing the exercise
            thread_id: Optional thread ID for checkpointing. If None, a unique ID will be generated.
            
        Returns:
            MathExercise object with combined analysis
        """
        if not image_paths:
            raise ValueError("At least one image path must be provided")
        
        # Generate thread_id if not provided
        if thread_id is None:
            import uuid
            thread_id = str(uuid.uuid4())
        
        # Initialize state with image paths
        initial_state = {
            "image_paths": image_paths,
            "base64_images": [],
            "raw_analyses": [],
            "structured_analyses": [],
            "combined_analysis": None,
            "exercise": None,
            "error": None,
            "current_image_index": 0
        }
        
        # Create config with thread_id for the checkpointer
        config = {"configurable": {"thread_id": thread_id}}
        
        # Run the workflow
        result = self.workflow.invoke(initial_state, config=config)
        
        if result["error"] is not None:
            raise Exception(f"Analysis failed: {result['error']}")
        
        if "exercise" not in result or result["exercise"] is None:
            raise Exception("Failed to create exercise object")
        
        return result["exercise"]
    
    def analyze_single_image(self, image_path: str, thread_id: str = None) -> MathExercise:
        """
        Convenience method to analyze a single image
        
        Args:
            image_path: Path to the image containing the exercise
            thread_id: Optional thread ID for checkpointing. If None, a unique ID will be generated.
            
        Returns:
            MathExercise object with analysis
        """
        return self.analyze_exercise([image_path], thread_id=thread_id)
    
    
