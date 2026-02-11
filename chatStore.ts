import { create } from 'zustand';
import { Conversation, Message } from '@/types/chat.types';
import { storageService } from '@/services/storageService';
import { generateConversationTitle } from '@/utils/formatters';

interface ChatStore {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;

  // Actions
  loadConversations: () => void;
  createConversation: () => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  togglePinConversation: (id: string) => void;
  toggleArchiveConversation: (id: string) => void;
  addTagToConversation: (id: string, tag: string) => void;
  removeTagFromConversation: (id: string, tag: string) => void;
  exportConversation: (id: string, format: 'json' | 'txt') => void;
  clearConversations: () => void;
  setSearchQuery: (query: string) => void;
  getCurrentConversation: () => Conversation | null;
  getFilteredConversations: () => Conversation[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
  searchQuery: '',

  loadConversations: () => {
    const conversations = storageService.getConversations();
    const currentId = storageService.getCurrentConversationId();
    set({ conversations, currentConversationId: currentId });
  },

  createConversation: () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'Нова розмова',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isPinned: false,
      isArchived: false,
    };

    set(state => {
      const conversations = [newConversation, ...state.conversations];
      storageService.saveConversations(conversations);
      storageService.saveCurrentConversationId(newConversation.id);
      return {
        conversations,
        currentConversationId: newConversation.id,
      };
    });

    return newConversation.id;
  },

  selectConversation: (id: string) => {
    set({ currentConversationId: id });
    storageService.saveCurrentConversationId(id);
  },

  deleteConversation: (id: string) => {
    set(state => {
      const conversations = state.conversations.filter(c => c.id !== id);
      const currentId = state.currentConversationId === id ? null : state.currentConversationId;
      
      storageService.saveConversations(conversations);
      storageService.saveCurrentConversationId(currentId);
      
      return { conversations, currentConversationId: currentId };
    });
  },

  updateConversationTitle: (id: string, title: string) => {
    set(state => {
      const conversations = state.conversations.map(c =>
        c.id === id ? { ...c, title, updatedAt: new Date() } : c
      );
      storageService.saveConversations(conversations);
      return { conversations };
    });
  },

  addMessage: (conversationId: string, message: Message) => {
    set(state => {
      const conversations = state.conversations.map(c => {
        if (c.id === conversationId) {
          const messages = [...c.messages, message];
          const title = c.messages.length === 0 
            ? generateConversationTitle(message.content)
            : c.title;
          
          return {
            ...c,
            messages,
            title,
            updatedAt: new Date(),
          };
        }
        return c;
      });
      
      storageService.saveConversations(conversations);
      return { conversations };
    });
  },

  updateMessage: (conversationId: string, messageId: string, content: string) => {
    set(state => {
      const conversations = state.conversations.map(c => {
        if (c.id === conversationId) {
          const messages = c.messages.map(m =>
            m.id === messageId ? { ...m, content } : m
          );
          return { ...c, messages, updatedAt: new Date() };
        }
        return c;
      });
      
      storageService.saveConversations(conversations);
      return { conversations };
    });
  },

  togglePinConversation: (id: string) => {
    set(state => {
      const conversations = state.conversations.map(c =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      );
      storageService.saveConversations(conversations);
      return { conversations };
    });
  },

  toggleArchiveConversation: (id: string) => {
    set(state => {
      const conversations = state.conversations.map(c =>
        c.id === id ? { ...c, isArchived: !c.isArchived } : c
      );
      storageService.saveConversations(conversations);
      return { conversations };
    });
  },

  addTagToConversation: (id: string, tag: string) => {
    set(state => {
      const conversations = state.conversations.map(c => {
        if (c.id === id) {
          const tags = c.tags || [];
          if (!tags.includes(tag)) {
            return { ...c, tags: [...tags, tag] };
          }
        }
        return c;
      });
      storageService.saveConversations(conversations);
      return { conversations };
    });
  },

  removeTagFromConversation: (id: string, tag: string) => {
    set(state => {
      const conversations = state.conversations.map(c => {
        if (c.id === id && c.tags) {
          return { ...c, tags: c.tags.filter(t => t !== tag) };
        }
        return c;
      });
      storageService.saveConversations(conversations);
      return { conversations };
    });
  },

  exportConversation: (id: string, format: 'json' | 'txt') => {
    const conversation = get().conversations.find(c => c.id === id);
    if (conversation) {
      storageService.exportConversation(conversation, format);
    }
  },

  clearConversations: () => {
    set({ conversations: [], currentConversationId: null });
    storageService.saveConversations([]);
    storageService.saveCurrentConversationId(null);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getCurrentConversation: () => {
    const state = get();
    return state.conversations.find(c => c.id === state.currentConversationId) || null;
  },

  getFilteredConversations: () => {
    const { conversations, searchQuery } = get();
    
    if (!searchQuery) {
      return conversations.filter(c => !c.isArchived);
    }

    return conversations.filter(c => {
      if (c.isArchived) return false;
      
      const titleMatch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const messageMatch = c.messages.some(m =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const tagMatch = c.tags?.some(t =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return titleMatch || messageMatch || tagMatch;
    });
  },
}));
