import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700 animate-fadeIn">
      <AlertCircle size={20} className="animate-pulse" />
      {message}
    </div>
  );
}