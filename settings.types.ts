export type ThemeMode = 'light' | 'dark' | 'auto';
export type LayoutMode = 'classic' | 'zen' | 'wide';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type MessageShape = 'rounded' | 'square' | 'pill';
export type InterfaceDensity = 'compact' | 'comfortable' | 'spacious';

export interface ModelSettings {
  version: 'gemini-2.0-flash-exp' | 'gemini-2.0-flash-thinking-exp-01-21' | 'gemini-exp-1206';
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}

export interface PersonalitySettings {
  name: string;
  systemPrompt: string;
  preset: 'professional' | 'friendly' | 'creative' | 'technical' | 'fun' | 'custom';
  language: string;
  responseStyle: 'concise' | 'detailed';
  useEmoji: boolean;
  formality: 'formal' | 'informal';
  roleProfile?: string;
}

export interface VisualSettings {
  theme: ThemeMode;
  accentColor: string;
  fontFamily: FontFamily;
  messageFontFamily: FontFamily;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  density: InterfaceDensity;
  messageShape: MessageShape;
  userMessageBg: string;
  assistantMessageBg: string;
  backgroundStyle: 'solid' | 'gradient' | 'pattern' | 'image';
  backgroundImage?: string;
  showAvatars: boolean;
  userAvatar?: string;
  assistantAvatar?: string;
}

export interface FunctionalSettings {
  layout: LayoutMode;
  autoSaveInterval: number;
  enterBehavior: 'send' | 'newline';
  showTimestamps: boolean;
  collapseLongMessages: boolean;
  codePreview: boolean;
  autoScroll: boolean;
  soundNotifications: boolean;
  speechToText: boolean;
  textToSpeech: boolean;
}

export interface KeyboardShortcuts {
  newChat: string;
  search: string;
  settings: string;
  toggleSidebar: string;
  focusInput: string;
}

export interface Settings {
  model: ModelSettings;
  personality: PersonalitySettings;
  visual: VisualSettings;
  functional: FunctionalSettings;
  shortcuts: KeyboardShortcuts;
}

export interface SettingsProfile {
  id: string;
  name: string;
  settings: Settings;
}
