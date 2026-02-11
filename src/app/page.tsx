'use client';

import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@/components/ui/native-select";
import { Button } from '@/components/ui/button';
import { analyseChartDatas } from './actions';
import { TWELVE_MOCK_DATAS } from './globals/mocks/twelve-mock-data';

const SYMBOLS = [
  { value: 'GBP/JPY', label: 'GBP/JPY', type: 'forex' },
  { value: 'EUR/USD', label: 'EUR/USD', type: 'forex' },
  { value: 'USD/JPY', label: 'USD/JPY', type: 'forex' },
  { value: 'GBP/USD', label: 'GBP/USD', type: 'forex' },
];

const TIMEFRAMES = [
  { value: '1min', label: '1 Minute', crypto: '1m' },
  { value: '5min', label: '5 Minutes', crypto: '5m' },
  { value: '15min', label: '15 Minutes', crypto: '15m' },
  { value: '1h', label: '1 Hour', crypto: '1h' },
  { value: '4h', label: '4 Hours', crypto: '4h' },
  { value: '1day', label: '1 Day', crypto: '1d' },
];

// Get your free API key from: https://twelvedata.com/
const TWELVE_DATA_API_KEY = 'b975cb65b1c84a1c82bb0ec9e94eabaa'; // Replace with your API key

export default function Home() {
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [symbol, setSymbol] = useState('GBP/JPY');
  const [timeframe, setTimeframe] = useState('15min');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForexData = async (sym: string, tf: string) => {
    const data = TWELVE_MOCK_DATAS as any;
    // const response = await fetch(
    //   `https://api.twelvedata.com/time_series?symbol=${sym}&interval=${tf}&outputsize=100&apikey=${TWELVE_DATA_API_KEY}`
    // );

    // if (!response.ok) {
    //   throw new Error('Failed to fetch forex data');
    // }

    // const data = await response.json();

    // if (data.status === 'error') {
    //   throw new Error(data.message || 'Failed to fetch forex data');
    // }

    // if (!data.values || data.values.length === 0) {
    //   throw new Error('No data available for this forex pair');
    // }

    // // Twelve Data returns data in reverse chronological order, so we reverse it
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
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
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

  const handlePredict = async () => {
    setLoading(true);
    try {
      const chartDatas = candlestickSeriesRef.current?.data();
      if (!chartDatas || chartDatas.length === 0) return;
      const resp = await analyseChartDatas({
        metadatas: {
          chartDatas: JSON.stringify(chartDatas),
          symbol,
          timeframe,
          accountBalance: 1000, // You can replace this with actual account balance if needed
        }
      });
      console.log('Analysis Result:', resp);
      // You can set the analysis result to state and display it in the UI as needed
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  // const handleAnalyze = async () => {
  //   setLoading(true);
  //   try {
  //     const resp = await analyzeImage({
  //       metadatas: {
  //         imageUrl: 'https://example.com/chart.png',
  //         accountBalance: 100,
  //         symbol: 'GBP/USD',
  //         timeframe: '1h',
  //       }
  //     });
  //     setAnalysisResult(resp.json);
  //     setResult(resp.text);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setResult('Error analyzing image');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Box minH="100vh" bg="gray.900" py={8} px={4}>
      <Container maxW="container.xl">
        <VStack gap={6} align="stretch">
          <HStack gap={4} justify="center">
            <NativeSelectRoot width="200px">
              <NativeSelectField
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                }}
                bg="gray.800"
                color="white"
                borderColor="gray.600"
                padding={'2px 2px 2px 10px'}
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
                bg="gray.800"
                color="white"
                borderColor="gray.600"
                padding={'2px 2px 2px 10px'}
              >
                {TIMEFRAMES.map((tf) => (
                  <option key={tf.value} value={tf.value}>
                    {tf.label}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            <Button onClick={handlePredict}>
              Make a prediction
            </Button>
          </HStack>

          {error && (
            <Box bg="red.900" color="red.200" p={4} borderRadius="md">
              <Text>{error}</Text>
            </Box>
          )}

          <Box
            id="chart-container"
            bg="gray.800"
            borderRadius="lg"
            position="relative"
            opacity={loading ? 0.5 : 1}
            transition="opacity 0.2s"
          />
        </VStack>
      </Container>
    </Box>
  );
}