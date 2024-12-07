import React, { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateImage, improvePrompt } from '../lib/api';
import { Button } from './ui/Button';
import { ErrorMessage } from './ui/ErrorMessage';
import { ImageDisplay } from './ImageDisplay';
import { FilterSelect } from './ui/FilterSelect';
import { PromptInput } from './PromptInput';
import { styleFilters, moodFilters, lightingFilters } from '../config/filters';
import type { ImageGenerationOptions } from '../types/filters';

export function ImageGenerator() {
  const [options, setOptions] = useState<ImageGenerationOptions>({
    prompt: '',
    style: '',
    mood: '',
    lighting: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const handleImprovePrompt = async () => {
    if (!options.prompt.trim()) return;
    
    setIsImprovingPrompt(true);
    setError('');
    
    try {
      const improvedPrompt = await improvePrompt(options.prompt);
      setOptions(prev => ({ ...prev, prompt: improvedPrompt }));
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) {
        setError('Сервер перегружен. Пожалуйста, подождите немного и попробуйте снова.');
      } else {
        setError(err instanceof Error ? err.message : 'Не удалось улучшить промпт');
      }
    } finally {
      setIsImprovingPrompt(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    
    const enhancedPrompt = `${options.prompt}. ${options.style ? `Стиль: ${styleFilters.find(f => f.id === options.style)?.name}` : ''} ${options.mood ? `Настроение: ${moodFilters.find(f => f.id === options.mood)?.name}` : ''} ${options.lighting ? `Освещение: ${lightingFilters.find(f => f.id === options.lighting)?.name}` : ''}`.trim();
    
    try {
      const imageUrl = await generateImage(enhancedPrompt);
      setGeneratedImage(imageUrl);
      setRetryCount(0);
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) {
        setError('Сервер перегружен. Система автоматически повторит попытку...');
        setRetryCount(prev => prev + 1);
      } else {
        setError(err instanceof Error ? err.message : 'Не удалось сгенерировать изображение');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-12 h-12 text-violet-600" />
          </motion.div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            AI Генератор
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Превратите ваши идеи в потрясающие визуальные образы с помощью FLUX
        </p>
      </motion.div>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleGenerate}
        className="glass-panel gradient-border rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <PromptInput
          prompt={options.prompt}
          onPromptChange={(prompt) => setOptions(prev => ({ ...prev, prompt }))}
          onImprove={handleImprovePrompt}
          isImprovingPrompt={isImprovingPrompt}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FilterSelect
            label="Стиль"
            filters={styleFilters}
            value={options.style}
            onChange={(value) => setOptions(prev => ({ ...prev, style: value }))}
          />
          <FilterSelect
            label="Настроение"
            filters={moodFilters}
            value={options.mood}
            onChange={(value) => setOptions(prev => ({ ...prev, mood: value }))}
          />
          <FilterSelect
            label="Освещение"
            filters={lightingFilters}
            value={options.lighting}
            onChange={(value) => setOptions(prev => ({ ...prev, lighting: value }))}
          />
        </div>

        <Button
          type="submit"
          isLoading={isGenerating}
          disabled={!options.prompt.trim()}
          className="w-full"
        >
          <Wand2 size={20} />
          Создать изображение
        </Button>
      </motion.form>

      {error && <ErrorMessage message={error} />}
      {retryCount > 0 && (
        <div className="text-sm text-gray-600 text-center animate-pulse">
          Попытка {retryCount}/3...
        </div>
      )}
      {generatedImage && <ImageDisplay imageUrl={generatedImage} />}
    </motion.div>
  );
}