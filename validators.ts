import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, ALLOWED_FILE_TYPES } from './constants';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Пароль повинен містити мінімум 8 символів');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль повинен містити хоча б одну велику літеру');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль повинен містити хоча б одну малу літеру');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Пароль повинен містити хоча б одну цифру');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateFile = (file: File): { 
  isValid: boolean; 
  error?: string 
} => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Файл занадто великий. Максимальний розмір: ${MAX_FILE_SIZE / 1024 / 1024}МБ`,
    };
  }
  
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_FILE_TYPES];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Непідтримуваний формат файлу',
    };
  }
  
  return { isValid: true };
};

export const validateImage = (file: File): { 
  isValid: boolean; 
  error?: string 
} => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Файл має бути зображенням (JPEG, PNG, GIF, WebP)',
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Зображення занадто велике. Максимальний розмір: ${MAX_FILE_SIZE / 1024 / 1024}МБ`,
    };
  }
  
  return { isValid: true };
};

export const validateApiKey = (apiKey: string): boolean => {
  return apiKey.length > 0 && apiKey.startsWith('AI');
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateTemperature = (temp: number): boolean => {
  return temp >= 0 && temp <= 2;
};

export const validateTopP = (topP: number): boolean => {
  return topP >= 0 && topP <= 1;
};

export const validateTopK = (topK: number): boolean => {
  return topK >= 0 && topK <= 100;
};
