export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AI Друг';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const GEMINI_MODELS = [
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)', description: 'Швидка модель для повсякденного використання' },
  { id: 'gemini-2.0-flash-thinking-exp-01-21', name: 'Gemini 2.0 Flash Thinking', description: 'Модель з поглибленим мисленням' },
  { id: 'gemini-exp-1206', name: 'Gemini Experimental 1206', description: 'Експериментальна модель' },
] as const;

export const ACCENT_COLORS = [
  { name: 'Синій', value: '#0ea5e9' },
  { name: 'Фіолетовий', value: '#8b5cf6' },
  { name: 'Рожевий', value: '#ec4899' },
  { name: 'Червоний', value: '#ef4444' },
  { name: 'Помаранчевий', value: '#f97316' },
  { name: 'Жовтий', value: '#eab308' },
  { name: 'Зелений', value: '#22c55e' },
  { name: 'Бірюзовий', value: '#14b8a6' },
  { name: 'Індиго', value: '#6366f1' },
  { name: 'Сірий', value: '#6b7280' },
] as const;

export const PERSONALITY_PRESETS = [
  {
    id: 'professional',
    name: 'Професійний',
    systemPrompt: 'Ти професійний AI-асистент. Надавай точні, структуровані та корисні відповіді. Використовуй формальний тон.',
  },
  {
    id: 'friendly',
    name: 'Дружній',
    systemPrompt: 'Ти дружній AI-асистент. Спілкуйся тепло та приємно, використовуй невимушений тон. Допомагай з ентузіазмом.',
  },
  {
    id: 'creative',
    name: 'Креативний',
    systemPrompt: 'Ти креативний AI-асистент. Пропонуй оригінальні ідеї, використовуй метафори та образний язик. Будь натхненним.',
  },
  {
    id: 'technical',
    name: 'Технічний',
    systemPrompt: 'Ти технічний експерт. Надавай детальні технічні пояснення, використовуй точну термінологію. Будь конкретним.',
  },
  {
    id: 'fun',
    name: 'Веселий',
    systemPrompt: 'Ти веселий AI-асистент. Використовуй гумор, емодзі та жарти. Роби спілкування легким та приємним.',
  },
] as const;

export const PROMPT_TEMPLATES = [
  {
    id: 'explain',
    name: 'Пояснення',
    category: 'Навчання',
    prompt: 'Поясни мені {topic} простими словами, як для початківця',
    variables: ['topic'],
  },
  {
    id: 'summarize',
    name: 'Підсумування',
    category: 'Робота',
    prompt: 'Підсумуй наступний текст в {sentences} реченнях:\n\n{text}',
    variables: ['sentences', 'text'],
  },
  {
    id: 'brainstorm',
    name: 'Мозковий штурм',
    category: 'Творчість',
    prompt: 'Допоможи провести мозковий штурм на тему: {topic}. Надай {count} креативних ідей',
    variables: ['topic', 'count'],
  },
  {
    id: 'code-review',
    name: 'Ревʼю коду',
    category: 'Програмування',
    prompt: 'Проаналізуй наступний код та надай рекомендації щодо покращення:\n\n{code}',
    variables: ['code'],
  },
] as const;

export const DEFAULT_SETTINGS = {
  model: {
    version: 'gemini-2.0-flash-exp' as const,
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxTokens: 8192,
  },
  personality: {
    name: 'AI Друг',
    systemPrompt: 'Ти корисний AI-асистент на імʼя AI Друг. Ти допомагаєш користувачам з різними завданнями, надаєш інформацію та підтримуєш приємну розмову.',
    preset: 'friendly' as const,
    language: 'uk',
    responseStyle: 'detailed' as const,
    useEmoji: true,
    formality: 'informal' as const,
  },
  visual: {
    theme: 'auto' as const,
    accentColor: '#0ea5e9',
    fontFamily: 'sans' as const,
    messageFontFamily: 'sans' as const,
    fontSize: 'medium' as const,
    density: 'comfortable' as const,
    messageShape: 'rounded' as const,
    userMessageBg: '#0ea5e9',
    assistantMessageBg: '#f3f4f6',
    backgroundStyle: 'solid' as const,
    showAvatars: true,
  },
  functional: {
    layout: 'classic' as const,
    autoSaveInterval: 30000,
    enterBehavior: 'send' as const,
    showTimestamps: true,
    collapseLongMessages: false,
    codePreview: true,
    autoScroll: true,
    soundNotifications: false,
    speechToText: false,
    textToSpeech: false,
  },
  shortcuts: {
    newChat: 'Ctrl+Shift+N',
    search: 'Ctrl+K',
    settings: 'Ctrl+,',
    toggleSidebar: 'Ctrl+B',
    focusInput: 'Ctrl+/',
  },
} as const;

export const LANGUAGES = [
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
];

export const STORAGE_KEYS = {
  CONVERSATIONS: 'ai-friend-conversations',
  SETTINGS: 'ai-friend-settings',
  CURRENT_CONVERSATION: 'ai-friend-current-conversation',
  THEME: 'ai-friend-theme',
} as const;
