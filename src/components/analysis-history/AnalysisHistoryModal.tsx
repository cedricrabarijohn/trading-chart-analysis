'use client';

import { Box, HStack, Text } from '@chakra-ui/react';
import { AnalysisHistoryItem } from '@/lib/localStorage';
import styles from '../../app/page.module.css';
import modalStyles from './AnalysisHistoryModal.module.css';
import { useEffect, useRef } from 'react';
import { CandlestickData, CandlestickSeries, Time } from 'lightweight-charts';

interface AnalysisHistoryModalProps {
  item: AnalysisHistoryItem;
  onClose: () => void;
}

export default function AnalysisHistoryModal({ item, onClose }: AnalysisHistoryModalProps) {
  // Chart rendering
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!item.chartData || !Array.isArray(item.chartData) || item.chartData.length === 0) return;
    // if (!chartContainerRef.current) return;

    // Dynamically import lightweight-charts for client-side rendering
    import('lightweight-charts').then((lw) => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
      const chartContainer = document.getElementById('history-chart-container');
      if (!chartContainer) return;
      const chart = lw.createChart(chartContainer, {
        width: chartContainer.clientWidth || 500,
        height: 300,
        layout: {
          background: { color: 'transparent' },
          textColor: 'white',
          fontSize: 13,
        },
        grid: {
          horzLines: { color: '#d3d3d333' },
          vertLines: { color: '#d3d3d333' },
        },
        localization: {
          priceFormatter: (price: number) => price.toFixed(5),
        },
      });
      chartInstanceRef.current = chart;
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });
      candlestickSeries.setData(item.chartData as CandlestickData<Time>[]);

      // Add price lines if present
      if (item.result.entryPrice) {
        candlestickSeries.createPriceLine({
          price: item.result.entryPrice,
          color: '#3b82f6',
          lineWidth: 2,
          lineStyle: 0,
          axisLabelVisible: true,
          title: 'Entry Price',
        });
      }
      if (item.result.takeProfit) {
        candlestickSeries.createPriceLine({
          price: item.result.takeProfit,
          color: '#22c55e',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'Take Profit',
        });
      }
      if (item.result.stopLoss) {
        candlestickSeries.createPriceLine({
          price: item.result.stopLoss,
          color: '#ef4444',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'Stop Loss',
        });
      }
    });

    // Cleanup chart on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [item.chartData, item.result.entryPrice, item.result.takeProfit, item.result.stopLoss]);
  const analysisResult = item.result;
  const TIMEFRAMES = [
    { value: '1min', label: '1 Minute' },
    { value: '5min', label: '5 Minutes' },
    { value: '15min', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1day', label: '1 Day' },
  ];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (!chartContainerRef.current || !chartInstanceRef.current) return;
      chartInstanceRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (!chartContainerRef.current || !chartInstanceRef.current) return;
      chartInstanceRef.current.remove();
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      <div className={modalStyles.overlay} onClick={onClose} />

      {/* Modal */}
      <div className={modalStyles.modal}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <Box>
            <HStack gap={3} mb={2}>
              <Text fontSize="2xl" fontWeight="700" color="white">
                {item.symbol}
              </Text>
              <span
                className={`${modalStyles.badge} ${analysisResult.tradeDirection === 'LONG' ? modalStyles.long : modalStyles.short
                  }`}
              >
                {analysisResult.tradeDirection}
              </span>
            </HStack>
            <Text fontSize="sm" color="#666">
              {TIMEFRAMES.find((tf) => tf.value === item.timeframe)?.label} • {formatDate(item.timestamp)}
            </Text>
          </Box>
          <button onClick={onClose} className={modalStyles.closeButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={modalStyles.modalContent}>
          {/* Chart Visualization */}
          {item.chartData && Array.isArray(item.chartData) && item.chartData.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div
                ref={chartContainerRef}
                id='history-chart-container'
                style={{ width: '100%', height: 300, background: '#18181b', borderRadius: 12, border: '1px solid #2a2a2a' }}
              />
            </div>
          )}
          <div className={styles.results}>
            {/* Trade Direction Card */}
            <div
              className={`${styles.card} ${styles.tradeCard} ${analysisResult.tradeDirection === 'LONG' ? styles.long : styles.short
                }`}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Trade Setup</h2>
                <span className={styles.badge}>{analysisResult.tradeDirection}</span>
              </div>

              {/* Entry Price, Stop Loss, Take Profit */}
              {(analysisResult.entryPrice || analysisResult.stopLoss || analysisResult.takeProfit) && (
                <div className={styles.priceGrid}>
                  {analysisResult.entryPrice && (
                    <div className={styles.priceItem}>
                      <span className={styles.priceLabel}>Entry Price</span>
                      <span className={styles.priceValue}>{analysisResult.entryPrice.toFixed(5)}</span>
                    </div>
                  )}
                  {analysisResult.takeProfit && (
                    <div className={styles.priceItem}>
                      <span className={styles.priceLabel}>Take Profit</span>
                      <span className={`${styles.priceValue} ${styles.takeProfit}`}>
                        {analysisResult.takeProfit.toFixed(5)}
                      </span>
                    </div>
                  )}
                  {analysisResult.stopLoss && (
                    <div className={styles.priceItem}>
                      <span className={styles.priceLabel}>Stop Loss</span>
                      <span className={`${styles.priceValue} ${styles.stopLoss}`}>
                        {analysisResult.stopLoss.toFixed(5)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Confidence Bar */}
              <div className={styles.confidenceBar}>
                <div className={styles.confidenceLabel}>
                  Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${analysisResult.confidence * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Metrics Card */}
            {(analysisResult.winratePercentage !== undefined || analysisResult.riskRewardRatio) && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Trade Metrics</h3>
                <div className={styles.metricsGrid}>
                  {analysisResult.winratePercentage !== undefined && (
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Win Rate</span>
                      <span className={styles.metricValue}>{analysisResult.winratePercentage.toFixed(1)}%</span>
                    </div>
                  )}
                  {analysisResult.riskRewardRatio && (
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Risk/Reward</span>
                      <span className={styles.metricValue}>1:{analysisResult.riskRewardRatio.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Support/Resistance Levels */}
            {analysisResult.keySupportResistanceLevels && analysisResult.keySupportResistanceLevels.length > 0 && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Key Levels</h3>
                <div className={styles.levelsList}>
                  {analysisResult.keySupportResistanceLevels.map((level: number, index: number) => (
                    <span key={index} className={styles.levelItem}>
                      {level.toFixed(3)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rationale */}
            {analysisResult.rationale && (
              <div className={`${styles.card} ${styles.rationaleCard}`}>
                <h3 className={styles.cardTitle}>Analysis Rationale</h3>
                <p className={styles.rationale}>{analysisResult.rationale}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
