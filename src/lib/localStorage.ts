// LocalStorage utility functions for user preferences and analysis history

export interface UserPreferences {
  symbol: string;
  timeframe: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  symbol: string;
  timeframe: string;
  result: any; // The full analysis result
  chartData?: any[]; // Chart data for visualization
}

const PREFERENCES_KEY = 'chart-analysis-preferences';
const HISTORY_KEY = 'chart-analysis-history';
const MAX_HISTORY_ITEMS = 50;

// User Preferences
export const savePreferences = (preferences: UserPreferences): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
};

export const loadPreferences = (): UserPreferences | null => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  }
  return null;
};

// Analysis History
export const saveAnalysisToHistory = (
  symbol: string,
  timeframe: string,
  result: any,
  chartData?: any[]
): void => {
  if (typeof window !== 'undefined') {
    try {
      const history = loadAnalysisHistory();
      const newItem: AnalysisHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        symbol,
        timeframe,
        result,
        chartData,
      };

      // Add to beginning and limit to MAX_HISTORY_ITEMS
      const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save analysis to history:', error);
    }
  }
};

export const loadAnalysisHistory = (): AnalysisHistoryItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load analysis history:', error);
      return [];
    }
  }
  return [];
};

export const deleteAnalysisFromHistory = (id: string): void => {
  if (typeof window !== 'undefined') {
    try {
      const history = loadAnalysisHistory();
      const updatedHistory = history.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to delete analysis from history:', error);
    }
  }
};

export const clearAnalysisHistory = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear analysis history:', error);
    }
  }
};

export const getAnalysisById = (id: string): AnalysisHistoryItem | null => {
  const history = loadAnalysisHistory();
  return history.find((item) => item.id === id) || null;
};
