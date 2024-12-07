import { STORAGE_CONFIG } from '../../config/constants';

export function extractImageUrl(data: any): string | null {
  // Case 1: Direct image URL in the response
  if (data.image_url) {
    const url = data.image_url;
    return transformImageUrl(url);
  }

  // Case 2: URL in the message content
  if (data.choices?.[0]?.message?.content) {
    const content = data.choices[0].message.content;
    
    // Try to find any URL pattern
    const urlPatterns = [
      /https:\/\/img\.naicloud\.xyz\/[a-zA-Z0-9/_.-]+/,
      /https?:\/\/[a-zA-Z0-9/_.-]+\.(jpg|jpeg|png|gif|webp)/i
    ];

    for (const pattern of urlPatterns) {
      const match = content.match(pattern);
      if (match) {
        return transformImageUrl(match[0]);
      }
    }
  }

  // Case 3: Check for base64 image data
  if (data.choices?.[0]?.message?.content) {
    const content = data.choices[0].message.content;
    const base64Match = content.match(/data:image\/[^;]+;base64,[^"]+/);
    if (base64Match) {
      return base64Match[0];
    }
  }

  return null;
}

function transformImageUrl(url: string): string {
  // If it's already using the correct domain, return as is
  if (url.startsWith(STORAGE_CONFIG.IMAGE_BASE_URL)) {
    return url;
  }

  // Extract the path from Google Storage URL
  const pathMatch = url.match(/\/([a-zA-Z0-9/_.-]+\.(jpg|jpeg|png|gif|webp))/i);
  if (pathMatch) {
    return `${STORAGE_CONFIG.IMAGE_BASE_URL}${pathMatch[0]}`;
  }

  // If no transformation needed or possible, return original URL
  return url;
}
