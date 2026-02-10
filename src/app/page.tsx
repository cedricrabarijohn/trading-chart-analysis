'use client';

import { useState } from "react";
import styles from "./page.module.css";
import { analyzeImage } from "./actions";

export default function Home() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const resp = await analyzeImage({
        metadatas: {
          imageUrl: 'https://example.com/chart.png',
        }
      });
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
      </main>
    </div>
  );
}
