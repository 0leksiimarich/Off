import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Common/Header';
import { useChatStore } from './store/chatStore';
import { useSettingsStore } from './store/settingsStore';
import './styles/globals.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { loadConversations } = useChatStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    loadConversations();
    loadSettings();
  }, [loadConversations, loadSettings]);

  return (
    <div className="h-screen flex flex-col">
      <Toaster position="top-right" />
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenSettings={() => setSettingsOpen(!settingsOpen)}
      />
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Вітаємо в AI Друг!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Ваш розумний помічник на основі Google Gemini 2.0
            </p>
            <button className="btn-primary">
              Почати нову розмову
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
