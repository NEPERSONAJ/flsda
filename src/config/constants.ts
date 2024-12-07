export const API_CONFIG = {
  API_KEY: 'sk-K8UFZvz7K59xvk8EoUfF0fC9x8Op4QbTP1HFcDost0qMi1Y0',
  API_URL: 'https://api.typegpt.net',
  MODEL: 'flux',
  TEXT_MODEL: 'meta-llama/Llama-3.3-70B-Instruct'
} as const;

export const STORAGE_CONFIG = {
  IMAGE_BASE_URL: 'https://img.naicloud.xyz'
} as const;

export const THEME = {
  colors: {
    primary: {
      light: '#9333EA',
      DEFAULT: '#7C3AED',
      dark: '#6D28D9'
    },
    secondary: {
      light: '#60A5FA',
      DEFAULT: '#3B82F6',
      dark: '#2563EB'
    },
    background: {
      light: '#F5F3FF',
      DEFAULT: '#EEF2FF',
      dark: '#E0E7FF'
    }
  }
} as const;