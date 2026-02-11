export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  images?: string[];
  files?: FileAttachment[];
  isStreaming?: boolean;
}

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url?: string;
  data?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  model?: string;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface PromptTemplate {
  id: string;
  name: string;
  prompt: string;
  category: string;
  variables?: string[];
}
