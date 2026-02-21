export interface IAnalysisResult {
    tradeDirection: 'LONG' | 'SHORT';
    entryPrice?: number; // Entry price for the trade
    confidence: number; // 0 to 1
    rationale: string; // Explanation of the analysis
    stopLoss?: number; // Optional stop loss level
    takeProfit?: number; // Optional take profit level
    keySupportResistanceLevels?: number[]; // Optional key support/resistance levels
    winratePercentage?: number; // Optional winrate percentage based on historical data
    riskRewardRatio?: number; // Optional risk-reward ratio based on the analysis
}