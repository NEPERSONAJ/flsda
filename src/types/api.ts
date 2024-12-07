export interface ImageGenerationRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
  model: string;
  stream: boolean;
}

export interface ImageGenerationResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
  image_url?: string;
}

export interface TextGenerationResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ApiError {
  error: {
    message: string;
    type?: string;
    code?: string;
  };
}