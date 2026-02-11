import { FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import { APP_NAME } from '@/utils/constants';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export const Header = ({ onToggleSidebar, onOpenSettings }: HeaderProps) => {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <FiMenu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">{APP_NAME}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onOpenSettings} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <FiSettings className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <FiUser className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
