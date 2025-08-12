import { 
  ExerciseListSchema, 
  ExerciseSchema, 
  AIConversionResponseSchema,
  ExerciseStatsSchema,
  CategorySchema,
  ExerciseCreateSchema,
  APIErrorSchema,
  type Exercise,
  type ExerciseList,
  type AIConversionResponse,
  type ExerciseStats,
  type ExerciseCreate,
  type ExerciseQuery,
  type APIError as APIErrorType
} from './api-schemas';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Custom error class for API errors
export class APIClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIClientError';
  }
}

// Base fetch wrapper with configurable timeout and error handling
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      signal: controller.signal,
      ...fetchOptions,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorDetails: APIErrorType;
      try {
        const errorData = await response.json();
        errorDetails = APIErrorSchema.parse(errorData);
      } catch {
        errorDetails = { detail: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      throw new APIClientError(
        errorDetails.detail || 'API request failed',
        response.status,
        errorDetails
      );
    }
    
    // Handle empty responses (like DELETE)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null as T;
    }
    
    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new APIClientError(
        `Request timeout after ${timeout / 1000} seconds - The server is taking longer than expected to process your request`,
        408
      );
    }
    
    if (error instanceof APIClientError) {
      throw error;
    }
    
    throw new APIClientError(
      'Network error - Please check your connection and try again',
      0,
      { originalError: error }
    );
  }
}

// Exercise API functions
export const exerciseAPI = {
  // Get all exercises with optional filtering
  async getExercises(query: ExerciseQuery = {}): Promise<ExerciseList> {
    const searchParams = new URLSearchParams();
    
    if (query.title) searchParams.append('title', query.title);
    if (query.category) searchParams.append('category', query.category);
    if (query.page) searchParams.append('page', query.page.toString());
    if (query.size) searchParams.append('size', query.size.toString());
    
    const endpoint = `/exercises${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const data = await apiCall<unknown>(endpoint);
    
    return ExerciseListSchema.parse(data);
  },

  // Get a single exercise by ID
  async getExercise(id: string): Promise<Exercise> {
    const data = await apiCall<unknown>(`/exercises/${id}`);
    return ExerciseSchema.parse(data);
  },

  // Create a new exercise
  async createExercise(exercise: ExerciseCreate): Promise<Exercise> {
    // Validate input data
    const validatedData = ExerciseCreateSchema.parse(exercise);
    
    const data = await apiCall<unknown>('/exercises', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
    
    return ExerciseSchema.parse(data);
  },

  // Update an existing exercise
  async updateExercise(id: string, updates: Partial<ExerciseCreate>): Promise<Exercise> {
    const data = await apiCall<unknown>(`/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    return ExerciseSchema.parse(data);
  },

  // Delete an exercise
  async deleteExercise(id: string): Promise<void> {
    await apiCall<void>(`/exercises/${id}`, {
      method: 'DELETE',
    });
  },

  // Get available categories
  async getCategories(): Promise<string[]> {
    const data = await apiCall<unknown>('/exercises/categories');
    
    // Backend returns array of category strings
    if (Array.isArray(data)) {
      return data.map(cat => CategorySchema.parse(cat));
    }
    
    throw new APIClientError('Invalid categories response format');
  },

  // Get exercise statistics
  async getStats(): Promise<ExerciseStats> {
    const data = await apiCall<unknown>('/exercises/stats');
    return ExerciseStatsSchema.parse(data);
  },

  // AI conversion with extended timeout (2 minutes)
  async convertImageToExercise(files: File[]): Promise<AIConversionResponse> {
    if (!files || files.length === 0) {
      throw new APIClientError('No files provided for AI conversion');
    }

    // Validate file types
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    for (const file of files) {
      if (!validImageTypes.includes(file.type)) {
        throw new APIClientError(`Invalid file type: ${file.type}. Please upload an image file.`);
      }
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const data = await apiCall<unknown>('/exercises/ai-conversion', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData - let browser set it with boundary
      body: formData,
      timeout: 120000, // 120 seconds (2 minutes) for AI processing
    });

    return AIConversionResponseSchema.parse(data);
  }
};

// Export individual functions for easier imports
export const {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  getCategories,
  getStats,
  convertImageToExercise
} = exerciseAPI;

// Export the API error class
export { APIClientError as APIError }; 