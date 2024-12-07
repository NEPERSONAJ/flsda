import { toast } from 'react-hot-toast';
import { fetchWithTimeout } from './fetch';
import { DownloadError } from '../errors/DownloadError';
import { createFileName, getFileExtension } from './fileUtils';

async function fetchImage(url: string): Promise<Blob> {
  // Try different approaches in order
  const methods = [
    // Method 1: Direct fetch with CORS
    () => fetchWithTimeout(url, {
      mode: 'cors',
      headers: { 'Accept': 'image/*' }
    }),
    
    // Method 2: Fetch without CORS
    () => fetchWithTimeout(url, { mode: 'no-cors' }),
    
    // Method 3: Proxy through a CORS-anywhere service
    () => fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`)
  ];

  let lastError: Error | null = null;

  for (const method of methods) {
    try {
      const response = await method();
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Empty response');
      }
      
      return blob;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      continue;
    }
  }

  throw new DownloadError(
    'Не удалось загрузить изображение',
    `All download methods failed. Last error: ${lastError?.message}`
  );
}

async function saveBlob(blob: Blob, filename: string): Promise<void> {
  // Modern browsers: Use showSaveFilePicker if available
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Image',
          accept: { [blob.type]: [`.${getFileExtension(blob)}`] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.warn('Native file save failed, falling back to legacy method:', error);
      }
    }
  }

  // Legacy fallback
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 100);
}

export async function downloadImage(imageUrl: string): Promise<void> {
  const toastId = toast.loading('Скачивание изображения...');
  
  try {
    const blob = await fetchImage(imageUrl);
    const filename = createFileName(getFileExtension(blob));
    await saveBlob(blob, filename);
    
    toast.success('Изображение успешно скачано!', {
      id: toastId,
      duration: 3000
    });
  } catch (error) {
    console.error('Download failed:', error);
    
    if (error instanceof DownloadError) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.error('Произошла ошибка при скачивании', { id: toastId });
    }
    
    // Always provide a fallback to view the image
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  }
}