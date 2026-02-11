import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { uk } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'PPP', { locale: uk });
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm', { locale: uk });
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'PPP HH:mm', { locale: uk });
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: uk });
};

export const formatConversationDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Сьогодні';
  }
  if (isYesterday(date)) {
    return 'Вчора';
  }
  if (isThisWeek(date)) {
    return format(date, 'EEEE', { locale: uk });
  }
  if (isThisMonth(date)) {
    return format(date, 'd MMMM', { locale: uk });
  }
  return format(date, 'd MMMM yyyy', { locale: uk });
};

export const formatTokenCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}М`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}К`;
  }
  return count.toString();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Байт';
  
  const k = 1024;
  const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateConversationTitle = (firstMessage: string): string => {
  const cleaned = firstMessage.trim();
  const maxLength = 50;
  
  if (cleaned.length <= maxLength) return cleaned;
  
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

export const highlightSearchText = (text: string, searchQuery: string): string => {
  if (!searchQuery) return text;
  
  const regex = new RegExp(`(${searchQuery})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};
