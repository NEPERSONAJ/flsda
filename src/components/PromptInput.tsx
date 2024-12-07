import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onImprove: () => void;
  isImprovingPrompt: boolean;
}

export function PromptInput({ prompt, onPromptChange, onImprove, isImprovingPrompt }: PromptInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <label className="block text-sm font-medium text-gray-700">Опишите желаемое изображение</label>
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Опишите изображение, которое хотите сгенерировать..."
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 
            focus:border-transparent min-h-[120px] resize-none transition-all duration-300
            pr-[140px] shadow-sm hover:border-purple-300 outline-none"
          required
        />
        {prompt.trim() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-2 top-2"
          >
            <Button
              type="button"
              onClick={onImprove}
              isLoading={isImprovingPrompt}
              className="!w-auto !py-2 !px-4"
            >
              <Sparkles className="w-4 h-4" />
              Улучшить
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}