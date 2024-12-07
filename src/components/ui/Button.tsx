import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({ isLoading, children, className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 
        hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl
        flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed 
        transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Генерация...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}