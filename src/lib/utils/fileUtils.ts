export function getFileExtension(blob: Blob): string {
  const type = blob.type.toLowerCase();
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('gif')) return 'gif';
  return 'png'; // Default fallback
}

export function createFileName(ext: string): string {
  const date = new Date().toISOString().split('T')[0];
  const random = Math.random().toString(36).substring(2, 8);
  return `ai-image-${date}-${random}.${ext}`;
}