import { API_CONFIG, STORAGE_CONFIG } from '../config/constants';
import type { ImageGenerationRequest, ImageGenerationResponse, TextGenerationResponse } from '../types/api';
import { withRetry } from './utils/retry';
import { rateLimiter } from './utils/rateLimit';
import { extractImageUrl } from './utils/imageUrl';

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function makeApiRequest<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_CONFIG.API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.API_KEY}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error?.message || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return response.json();
}

export async function generateImage(prompt: string): Promise<string> {
  return rateLimiter.enqueue(async () => {
    return withRetry(async () => {
      try {
        const requestData = {
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          model: API_CONFIG.MODEL,
          stream: false
        };

        const data = await makeApiRequest<ImageGenerationResponse>('/v1/chat/completions', requestData);
        
        const imageUrl = extractImageUrl(data);
        if (!imageUrl) {
          console.error('Failed to extract image URL from response:', JSON.stringify(data));
          throw new ApiError('Не удалось получить URL изображения из ответа. Пожалуйста, попробуйте еще раз.');
        }

        return imageUrl;
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.statusCode === 429) {
            throw new ApiError('Сервер перегружен, пожалуйста, подождите...', 429);
          }
          throw error;
        }
        console.error('Image generation failed:', error);
        throw new ApiError('Произошла непредвиденная ошибка при генерации изображения');
      }
    }, {
      maxRetries: 3,
      initialDelay: 2000,
      maxDelay: 10000
    });
  });
}

export async function improvePrompt(prompt: string): Promise<string> {
  return rateLimiter.enqueue(async () => {
    return withRetry(async () => {
      try {
        const systemMessage = `You are an expert AI image prompt engineer specializing in creating detailed, vivid prompts for image generation. Your task is to enhance the given prompt by:

1. Adding specific artistic style elements
2. Improving composition and layout details
3. Enhancing lighting and atmosphere descriptions
4. Including relevant technical terms
5. Maintaining the original concept while making it more detailed

Important: Respond ONLY with the enhanced prompt. No explanations or additional text.`;

        const requestData = {
          messages: [
            {
              role: "system",
              content: systemMessage
            },
            {
              role: "user",
              content: `Enhance this image generation prompt: "${prompt}"`
            }
          ],
          model: API_CONFIG.TEXT_MODEL,
          stream: false,
          temperature: 0.7,
          max_tokens: 200
        };

        const data = await makeApiRequest<TextGenerationResponse>('/v1/chat/completions', requestData);
        const improvedPrompt = data.choices?.[0]?.message?.content;

        if (!improvedPrompt) {
          throw new ApiError('Не удалось улучшить промпт');
        }

        return improvedPrompt.trim();
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.statusCode === 429) {
            throw new ApiError('Сервер перегружен, попробуйте позже', 429);
          }
          throw error;
        }
        throw new ApiError('Не удалось улучшить промпт');
      }
    }, {
      maxRetries: 2,
      initialDelay: 1500,
      maxDelay: 5000
    });
  });
}