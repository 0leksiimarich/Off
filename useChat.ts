import { useState, useCallback, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useSettingsStore } from '@/store/settingsStore';
import { geminiService } from '@/services/geminiService';
import { Message } from '@/types/chat.types';
import toast from 'react-hot-toast';

export const useChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const { 
    getCurrentConversation, 
    addMessage, 
    currentConversationId,
    createConversation,
  } = useChatStore();
  
  const { settings } = useSettingsStore();

  // Ініціалізація Gemini при зміні налаштувань
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        geminiService.initialize(apiKey);
        geminiService.setModel(settings.model, settings.personality.systemPrompt);
      } catch (error) {
        console.error('Помилка ініціалізації Gemini:', error);
      }
    }
  }, [settings.model, settings.personality.systemPrompt]);

  const sendMessage = useCallback(async (content: string, images?: string[]) => {
    if (!content.trim() && !images?.length) return;

    let conversationId = currentConversationId;
    
    // Створити нову розмову якщо немає активної
    if (!conversationId) {
      conversationId = createConversation();
    }

    const conversation = getCurrentConversation();
    if (!conversation) return;

    // Додати повідомлення користувача
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      images,
    };

    addMessage(conversationId, userMessage);

    // Створити повідомлення асистента (яке буде заповнюватись)
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    addMessage(conversationId, assistantMessage);
    setIsStreaming(true);
    setCurrentStreamingMessage('');

    try {
      // Ініціалізувати чат з історією
      const history = [...conversation.messages, userMessage];
      geminiService.startChat(history);

      // Відправити повідомлення зі стрімінгом
      let fullResponse = '';
      
      for await (const chunk of geminiService.sendMessageStream(content)) {
        fullResponse += chunk;
        setCurrentStreamingMessage(fullResponse);
        
        // Оновити повідомлення в store
        useChatStore.getState().updateMessage(
          conversationId,
          assistantMessageId,
          fullResponse
        );
      }

      // Фінальне оновлення
      useChatStore.getState().updateMessage(
        conversationId,
        assistantMessageId,
        fullResponse
      );

    } catch (error) {
      console.error('Помилка при відправці повідомлення:', error);
      toast.error('Не вдалося отримати відповідь від AI');
      
      // Видалити незавершене повідомлення асистента
      const updatedConversation = getCurrentConversation();
      if (updatedConversation) {
        const filteredMessages = updatedConversation.messages.filter(
          m => m.id !== assistantMessageId
        );
        // Оновити розмову без помилкового повідомлення
        useChatStore.setState(state => ({
          conversations: state.conversations.map(c =>
            c.id === conversationId ? { ...c, messages: filteredMessages } : c
          ),
        }));
      }
    } finally {
      setIsStreaming(false);
      setCurrentStreamingMessage('');
    }
  }, [currentConversationId, getCurrentConversation, addMessage, createConversation]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setCurrentStreamingMessage('');
  }, []);

  const regenerateResponse = useCallback(async (messageId: string) => {
    const conversation = getCurrentConversation();
    if (!conversation) return;

    const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    // Знайти попереднє повідомлення користувача
    const userMessage = conversation.messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    // Видалити поточну відповідь
    const messagesUpToUser = conversation.messages.slice(0, messageIndex);
    
    // Тимчасово оновити історію
    useChatStore.setState(state => ({
      conversations: state.conversations.map(c =>
        c.id === conversation.id ? { ...c, messages: messagesUpToUser } : c
      ),
    }));

    // Регенерувати відповідь
    await sendMessage(userMessage.content, userMessage.images);
  }, [getCurrentConversation, sendMessage]);

  return {
    sendMessage,
    stopStreaming,
    regenerateResponse,
    isStreaming,
    currentStreamingMessage,
  };
};
