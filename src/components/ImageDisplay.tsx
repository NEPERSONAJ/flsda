import React, { useState } from 'react';
import { Image as ImageIcon, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadImage } from '../lib/utils/download';
import { toast } from 'react-hot-toast';

interface ImageDisplayProps {
  imageUrl: string;
}

export function ImageDisplay({ imageUrl }: ImageDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      await downloadImage(imageUrl);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Не удалось скачать изображение');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 p-1 mx-auto max-w-2xl"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <ImageIcon size={24} className="text-purple-600" />
              Сгенерированное изображение
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-blue-600 
                  hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full 
                  shadow-lg flex items-center gap-2 transition-all duration-300 justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={20} className={isDownloading ? 'animate-bounce' : ''} />
                <span className="font-medium">
                  {isDownloading ? 'Скачивание...' : 'Скачать'}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenInNewTab}
                className="bg-white border border-purple-200 hover:border-purple-300 
                  text-purple-600 px-4 py-2 rounded-full shadow-lg flex items-center 
                  gap-2 transition-all duration-300"
              >
                <ExternalLink size={20} />
              </motion.button>
            </div>
          </div>
          <motion.div
            className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={imageUrl}
              alt="Сгенерированное изображение"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}