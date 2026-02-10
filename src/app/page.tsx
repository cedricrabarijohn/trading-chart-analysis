'use client';

import { useState } from "react";
import styles from "./page.module.css";
import { analyzeImage } from "./actions";
import { IAnalysisResult } from "./app";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<IAnalysisResult | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const resp = await analyzeImage({
        metadatas: {
          imageUrl: 'https://example.com/chart.png',
          accountBalance: 100,
          symbol: 'GBP/USD',
          timeframe: '1h',
        }
      });
      setAnalysisResult(resp.json);
      setResult(resp.text);
    } catch (error) {
      console.error('Error:', error);
      setResult('Error analyzing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Image Analysis</h1>
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
        {result && <p>{result}</p>}
        {analysisResult && (
          <div>
            <h2>Analysis Result</h2>
            <p>Trade Direction: {analysisResult.tradeDirection}</p>
            <p>Confidence: {analysisResult.confidence}</p>
            <p>Rationale: {analysisResult.rationale}</p>
            {analysisResult.stopLoss && <p>Stop Loss: {analysisResult.stopLoss}</p>}
            {analysisResult.takeProfit && <p>Take Profit: {analysisResult.takeProfit}</p>}
            {analysisResult.keySupportResistanceLevels && (
              <p>Key Support/Resistance Levels: {analysisResult.keySupportResistanceLevels.join(', ')}</p>
            )}
            {analysisResult.winratePercentage && <p>Winrate Percentage: {analysisResult.winratePercentage}</p>}
            {analysisResult.riskRewardRatio && <p>Risk/Reward Ratio: {analysisResult.riskRewardRatio.join(':')}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
