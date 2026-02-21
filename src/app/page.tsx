'use client';

import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Card,
} from "@chakra-ui/react";
import styles from "./page.module.css";
import { NativeSelectRoot, NativeSelectField } from "@/components/ui/native-select";
import { Button } from '@/components/ui/button';
import { analyseChartDatas } from './actions';
import { TWELVE_MOCK_DATAS } from './globals/mocks/twelve-mock-data';
import { XAI_MOCK_DATAS } from './globals/mocks/xai-mock-datas';
import { IAnalysisResult } from './app';

const SYMBOLS = [
  { value: 'XAU/USD', label: 'XAU/USD', type: 'forex' },
  { value: 'GBP/JPY', label: 'GBP/JPY', type: 'forex' },
  { value: 'GBP/USD', label: 'GBP/USD', type: 'forex' },
  { value: 'EUR/USD', label: 'EUR/USD', type: 'forex' },
];

const TIMEFRAMES = [
  { value: '1min', label: '1 Minute' },
  { value: '5min', label: '5 Minutes' },
  { value: '15min', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1day', label: '1 Day' },
];

export default function Home() {
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [symbol, setSymbol] = useState('GBP/JPY');
  const [timeframe, setTimeframe] = useState('15min');
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<IAnalysisResult | null>(null);

  const fetchForexData = async (sym: string, tf: string) => {
    // const data = TWELVE_MOCK_DATAS as any;
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${sym}&interval=${tf}&timezone=Europe/Moscow&outputsize=1000&apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forex data');
    }

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message || 'Failed to fetch forex data');
    }

    if (!data.values || data.values.length === 0) {
      throw new Error('No data available for this forex pair');
    }

    // Twelve Data returns data in reverse chronological order, so we reverse it
    return data.values.reverse().map((d: any) => ({
      time: new Date(d.datetime).getTime() / 1000,
      open: parseFloat(d.open),
      high: parseFloat(d.high),
      low: parseFloat(d.low),
      close: parseFloat(d.close),
    }));
  };

  const fetchChartData = async (sym: string, tf: string) => {
    setLoading(true);
    setError(null);
    try {
      const symbolData = SYMBOLS.find(s => s.value === sym);
      let chartData;

      if (symbolData?.type === 'forex') {
        chartData = await fetchForexData(sym, tf);
      }

      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(chartData);
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) return;

    const chart = createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: 600,
      layout: {
        background: {
          color: 'transparent'
        },
        textColor: 'white',
        fontSize: 14,
        panes: {
          separatorColor: 'transparent'
        }
      },
      grid: {
        horzLines: {
          color: '#d3d3d333'
        },
        vertLines: {
          color: '#d3d3d333'
        }
      },
      localization: {
        timeFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        },
        priceFormatter: (price: number) => price.toFixed(5),
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#ffffff',
      downColor: '#666666',
      borderVisible: false,
      wickUpColor: '#ffffff',
      wickDownColor: '#666666',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainer.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    fetchChartData(symbol, timeframe);
  }, [symbol, timeframe]);

  // Reset analysis when symbol or timeframe changes
  useEffect(() => {
    setAnalysisResult(null);
    setError(null);
  }, [symbol, timeframe]);

  const handlePredict = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const chartDatas = candlestickSeriesRef.current?.data();
      if (!chartDatas || chartDatas.length === 0) {
        setError('No chart data available. Please wait for data to load.');
        return;
      }
      const resp = await analyseChartDatas({
        metadatas: {
          chartDatas: JSON.stringify(chartDatas),
          symbol,
          timeframe,
          accountBalance: 100000, // You can replace this with actual account balance if needed
        }
      });
      if (!resp?.json) {
        setError('Analysis failed. Please try again.');
        return;
      }
      setAnalysisResult(resp.json)
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" py={8} px={10} display={'flex'} justifyContent={'center'} className={styles.page}>
      <Container maxW="2xl">
        <VStack gap={6} align="stretch">
          {/* Header Section */}
          <Box textAlign="center" mb={2}>
            <Text fontSize="3xl" fontWeight="700" color="white" letterSpacing="-0.02em" mb={2}>
              Chart Analysis
            </Text>
            <Text fontSize="sm" color="#888" textTransform="uppercase" letterSpacing="0.1em">
              AI-Powered Trading Insights
            </Text>
          </Box>
          <HStack gap={4} justify="center" flexWrap={'wrap'}>
            <NativeSelectRoot width="200px">
              <NativeSelectField
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                }}
                bg="#1a1a1a"
                color="white"
                borderColor="#2a2a2a"
                padding={'2px 2px 2px 10px'}
                _hover={{ bg: '#252525', borderColor: '#404040' }}
              >
                {SYMBOLS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>

            <NativeSelectRoot width="200px">
              <NativeSelectField
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value)
                }}
                bg="#1a1a1a"
                color="white"
                borderColor="#2a2a2a"
                padding={'2px 2px 2px 10px'}
                _hover={{ bg: '#252525', borderColor: '#404040' }}
              >
                {TIMEFRAMES.map((tf) => (
                  <option key={tf.value} value={tf.value}>
                    {tf.label}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            <Button
              onClick={handlePredict}
              bg="white"
              color="black"
              _hover={{ bg: '#e8e8e8' }}
              _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              borderRadius="8px"
              fontWeight="600"
              disabled={loading || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Chart'}
            </Button>
          </HStack>

          {/* Status Messages */}
          {error && (
            <Box bg="rgba(255, 255, 255, 0.05)" color="#888" p={4} borderRadius="8px" border="1px solid #2a2a2a">
              <Text>{error}</Text>
            </Box>
          )}

          {/* Chart and Results Container - Use order to control display */}
          <VStack gap={6} align="stretch" display="flex" flexDirection="column">
            {/* Loading State for Analysis */}
            {isAnalyzing && (
              <Box className={styles.loadingOverlay}>
                <VStack gap={4} align="center">
                  <Box className={styles.spinner} />
                  <VStack gap={1}>
                    <Text fontSize="lg" fontWeight="600" color="white">
                      Analyzing {symbol}
                    </Text>
                    <Text fontSize="sm" color="#888">
                      Evaluating market conditions and generating insights...
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            )}

            {/* Analysis Results */}
            {analysisResult && !isAnalyzing && (
              <Box>
                <HStack justify="space-between" align="center" mb={4} pb={3} borderBottom="1px solid #2a2a2a">
                  <Box>
                    <Text fontSize="xl" fontWeight="700" color="white">
                      Analysis Results
                    </Text>
                    <Text fontSize="sm" color="#666" mt={1}>
                      {symbol} • {TIMEFRAMES.find(tf => tf.value === timeframe)?.label} • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </Box>
                </HStack>
                <div className={styles.results}>
                  {/* Trade Direction Card */}
                  <div className={`${styles.card} ${styles.tradeCard} ${analysisResult.tradeDirection === 'LONG' ? styles.long : styles.short}`}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>Trade Setup</h2>
                      <span className={styles.badge}>
                        {analysisResult.tradeDirection}
                      </span>
                    </div>

                    {/* Entry Price, Stop Loss, Take Profit */}
                    {(analysisResult.entryPrice || analysisResult.stopLoss || analysisResult.takeProfit) && (
                      <div className={styles.priceGrid}>
                        {analysisResult.entryPrice && (
                          <div className={styles.priceItem}>
                            <span className={styles.priceLabel}>Entry Price</span>
                            <span className={styles.priceValue}>
                              {analysisResult.entryPrice.toFixed(5)}
                            </span>
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
                        <div
                          className={styles.progressFill}
                          style={{ width: `${analysisResult.confidence * 100}%` }}
                        />
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
                            <span className={styles.metricValue}>
                              {analysisResult.winratePercentage.toFixed(1)}%
                            </span>
                          </div>
                        )}
                        {analysisResult.riskRewardRatio && (
                          <div className={styles.metric}>
                            <span className={styles.metricLabel}>Risk/Reward</span>
                            <span className={styles.metricValue}>
                              1:{analysisResult.riskRewardRatio.toFixed(2)}
                            </span>
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
                        {analysisResult.keySupportResistanceLevels.map((level, index) => (
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
              </Box>)
            }
            {/* Chart Section */}
            <Box>
              <HStack justify="space-between" mb={3} px={2}>
                <Text fontSize="sm" color="#888" fontWeight="600">
                  {analysisResult ? 'Chart Data' : `${SYMBOLS.find(s => s.value === symbol)?.label} \u2022 ${TIMEFRAMES.find(tf => tf.value === timeframe)?.label}`}
                </Text>
                {loading && !analysisResult && (
                  <Text fontSize="xs" color="#666" fontStyle="italic">
                    Loading chart data...
                  </Text>
                )}
              </HStack>
              <Box
                id="chart-container"
                bg="#1a1a1a"
                borderRadius="12px"
                position="relative"
                opacity={loading ? 0.5 : 1}
                transition="opacity 0.2s"
                border="1px solid #2a2a2a"
              />
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}