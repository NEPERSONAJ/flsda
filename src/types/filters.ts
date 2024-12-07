export interface ImageFilter {
  id: string;
  name: string;
  description: string;
}

export interface ImageGenerationOptions {
  prompt: string;
  style: string;
  mood: string;
  lighting: string;
}