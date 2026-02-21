'use client';

import { Box, HStack, VStack, Text, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  loadAnalysisHistory,
  deleteAnalysisFromHistory,
  clearAnalysisHistory,
  AnalysisHistoryItem,
} from '@/lib/localStorage';
import styles from './AnalysisHistory.module.css';

interface AnalysisHistoryProps {
  onLoadAnalysis: (item: AnalysisHistoryItem) => void;
  currentAnalysisId?: string;
}

export default function AnalysisHistory({ onLoadAnalysis, currentAnalysisId }: AnalysisHistoryProps) {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHistory(loadAnalysisHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAnalysisFromHistory(id);
    setHistory(loadAnalysisHistory());
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all analysis history?')) {
      clearAnalysisHistory();
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
        aria-label="Toggle history"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {history.length > 0 && <span className={styles.badge}>{history.length}</span>}
      </button>

      {/* History Panel */}
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.panelHeader}>
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="lg" fontWeight="700" color="white">
                Analysis History
              </Text>
              <Text fontSize="xs" color="#666" mt={1}>
                {history.length} {history.length === 1 ? 'analysis' : 'analyses'}
              </Text>
            </Box>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </HStack>

          {history.length > 0 && (
            <button onClick={handleClearAll} className={styles.clearButton}>
              Clear All
            </button>
          )}
        </div>

        <div className={styles.panelContent}>
          {history.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <Text fontSize="sm" color="#666" mt={3}>
                No analysis history yet
              </Text>
              <Text fontSize="xs" color="#444" mt={1}>
                Your analyses will appear here
              </Text>
            </div>
          ) : (
            <VStack gap={2} align="stretch">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.historyItem} ${currentAnalysisId === item.id ? styles.active : ''}`}
                  onClick={() => {
                    onLoadAnalysis(item);
                    setIsOpen(false);
                  }}
                >
                  <HStack justify="space-between" align="start" width="100%">
                    <Box flex="1" minWidth="0">
                      <HStack gap={2} mb={1}>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="white"
                          className={styles.symbol}
                        >
                          {item.symbol}
                        </Text>
                        <span className={`${styles.directionBadge} ${item.result.tradeDirection === 'LONG' ? styles.long : styles.short}`}>
                          {item.result.tradeDirection}
                        </span>
                      </HStack>
                      <HStack gap={3} mb={1}>
                        <Text fontSize="xs" color="#888">
                          {item.timeframe}
                        </Text>
                        {item.result.confidence && (
                          <Text fontSize="xs" color="#888">
                            {(item.result.confidence * 100).toFixed(0)}% confidence
                          </Text>
                        )}
                      </HStack>
                      <Text fontSize="xs" color="#666">
                        {formatDate(item.timestamp)}
                      </Text>
                    </Box>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className={styles.deleteButton}
                      aria-label="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </HStack>
                </div>
              ))}
            </VStack>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
}
