import { create } from 'zustand';
import { Settings, SettingsProfile } from '@/types/settings.types';
import { storageService } from '@/services/storageService';
import { DEFAULT_SETTINGS } from '@/utils/constants';

interface SettingsStore {
  settings: Settings;
  profiles: SettingsProfile[];
  activeProfileId: string | null;

  // Actions
  loadSettings: () => void;
  updateModelSettings: (settings: Partial<Settings['model']>) => void;
  updatePersonalitySettings: (settings: Partial<Settings['personality']>) => void;
  updateVisualSettings: (settings: Partial<Settings['visual']>) => void;
  updateFunctionalSettings: (settings: Partial<Settings['functional']>) => void;
  updateShortcuts: (shortcuts: Partial<Settings['shortcuts']>) => void;
  resetSettings: () => void;
  exportSettings: () => void;
  importSettings: (file: File) => Promise<void>;
  createProfile: (name: string) => void;
  loadProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  applyTheme: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  profiles: [],
  activeProfileId: null,

  loadSettings: () => {
    const savedSettings = storageService.getSettings();
    if (savedSettings) {
      set({ settings: savedSettings });
      get().applyTheme();
    } else {
      set({ settings: DEFAULT_SETTINGS });
      get().applyTheme();
    }
  },

  updateModelSettings: (newSettings) => {
    set(state => {
      const settings = {
        ...state.settings,
        model: { ...state.settings.model, ...newSettings },
      };
      storageService.saveSettings(settings);
      return { settings };
    });
  },

  updatePersonalitySettings: (newSettings) => {
    set(state => {
      const settings = {
        ...state.settings,
        personality: { ...state.settings.personality, ...newSettings },
      };
      storageService.saveSettings(settings);
      return { settings };
    });
  },

  updateVisualSettings: (newSettings) => {
    set(state => {
      const settings = {
        ...state.settings,
        visual: { ...state.settings.visual, ...newSettings },
      };
      storageService.saveSettings(settings);
      get().applyTheme();
      return { settings };
    });
  },

  updateFunctionalSettings: (newSettings) => {
    set(state => {
      const settings = {
        ...state.settings,
        functional: { ...state.settings.functional, ...newSettings },
      };
      storageService.saveSettings(settings);
      return { settings };
    });
  },

  updateShortcuts: (newShortcuts) => {
    set(state => {
      const settings = {
        ...state.settings,
        shortcuts: { ...state.settings.shortcuts, ...newShortcuts },
      };
      storageService.saveSettings(settings);
      return { settings };
    });
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
    storageService.saveSettings(DEFAULT_SETTINGS);
    get().applyTheme();
  },

  exportSettings: () => {
    const { settings } = get();
    storageService.exportSettings(settings);
  },

  importSettings: async (file: File) => {
    try {
      const settings = await storageService.importSettings(file);
      set({ settings });
      storageService.saveSettings(settings);
      get().applyTheme();
    } catch (error) {
      console.error('Помилка при імпорті налаштувань:', error);
      throw error;
    }
  },

  createProfile: (name: string) => {
    const { settings, profiles } = get();
    const newProfile: SettingsProfile = {
      id: crypto.randomUUID(),
      name,
      settings: { ...settings },
    };
    set({ profiles: [...profiles, newProfile] });
  },

  loadProfile: (id: string) => {
    const { profiles } = get();
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      set({ settings: profile.settings, activeProfileId: id });
      storageService.saveSettings(profile.settings);
      get().applyTheme();
    }
  },

  deleteProfile: (id: string) => {
    set(state => ({
      profiles: state.profiles.filter(p => p.id !== id),
      activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
    }));
  },

  applyTheme: () => {
    const { settings } = get();
    const root = document.documentElement;

    // Застосування теми (світла/темна)
    if (settings.visual.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.visual.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Застосування акцентного кольору
    root.style.setProperty('--accent-color', settings.visual.accentColor);

    // Застосування шрифтів
    const fontFamilies = {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    };
    root.style.setProperty('--font-family', fontFamilies[settings.visual.fontFamily]);
    root.style.setProperty('--message-font-family', fontFamilies[settings.visual.messageFontFamily]);

    // Застосування розміру шрифту
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px',
    };
    root.style.setProperty('--font-size', fontSizes[settings.visual.fontSize]);
  },
}));
