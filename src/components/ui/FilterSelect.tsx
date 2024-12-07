import React from 'react';
import { motion } from 'framer-motion';
import type { ImageFilter } from '../../types/filters';

interface FilterSelectProps {
  label: string;
  filters: ImageFilter[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterSelect({ label, filters, value, onChange }: FilterSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 
          focus:border-transparent bg-white shadow-sm transition-all duration-300
          hover:border-purple-300 outline-none appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
      >
        <option value="">Выберите {label.toLowerCase()}</option>
        {filters.map((filter) => (
          <option key={filter.id} value={filter.id}>
            {filter.name}
          </option>
        ))}
      </select>
      {value && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500"
        >
          {filters.find(f => f.id === value)?.description}
        </motion.p>
      )}
    </motion.div>
  );
}