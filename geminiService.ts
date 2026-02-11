import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { ModelSettings } from '@/types/settings.types';
import { Message } from '@/types/chat.types';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private chatSession: ChatSession | null = null;

  initialize(apiKey: string): void {
    if (!apiKey) {
      throw new Error('API ключ Gemini не надано');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  setModel(modelSettings: ModelSettings, systemPrompt?: string): void {
    if (!this.genAI) {
      throw new Error('Gemini не ініціалізовано. Спочатку викличте initialize()');
    }

    const generationConfig = {
      temperature: modelSettings.temperature,
      topP: modelSettings.topP,
      topK: modelSettings.topK,
      maxOutputTokens: modelSettings.maxTokens,
    };

    this.model = this.genAI.getGenerativeModel({
      model: modelSettings.version,
      generationConfig,
      systemInstruction: systemPrompt,
    });
  }

  startChat(history: Message[] = []): void {
    if (!this.model) {
      throw new Error('Модель не налаштовано. Спочатку викличте setModel()');
    }

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    this.chatSession = this.model.startChat({
      history: formattedHistory,
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error('Чат не розпочато. Спочатку викличте startChat()');
    }

    try {
      const result = await this.chatSession.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Помилка при відправці повідомлення:', error);
      throw new Error('Не вдалося отримати відповідь від AI');
    }
  }

  async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.chatSession) {
      throw new Error('Чат не розпочато. Спочатку викличте startChat()');
    }

    try {
      const result = await this.chatSession.sendMessageStream(message);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield chunkText;
      }
    } catch (error) {
      console.error('Помилка при стрімінгу повідомлення:', error);
      throw new Error('Не вдалося отримати відповідь від AI');
    }
  }

  async sendMessageWithImage(message: string, imageData: string): Promise<string> {
    if (!this.model) {
      throw new Error('Модель не налаштовано');
    }

    try {
      const imageParts = {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: 'image/jpeg',
        },
      };

      const result = await this.model.generateContent([message, imageParts]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Помилка при аналізі зображення:', error);
      throw new Error('Не вдалося проаналізувати зображення');
    }
  }

  async countTokens(text: string): Promise<number> {
    if (!this.model) {
      throw new Error('Модель не налаштовано');
    }

    try {
      const result = await this.model.countTokens(text);
      return result.totalTokens;
    } catch (error) {
      console.error('Помилка при підрахунку токенів:', error);
      return 0;
    }
  }

  resetChat(): void {
    this.chatSession = null;
  }
}

export const geminiService = new GeminiService();
