'use server';

import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';
import { IAnalysisResult } from './app';

export interface AnalyzeImageRequest {
    metadatas: {
        imageUrl: string;
        symbol?: string; // eg : 'GBP/USD'
        timeframe?: string; // eg : '1h'
        accountBalance?: number; // eg : 1000
    }
}

export interface AnalyzeImageResponse {
    text: string;
    json: IAnalysisResult;
}

export async function analyzeImage(params: AnalyzeImageRequest): Promise<AnalyzeImageResponse> {
    const defaultTimeFrame = '15mn';
    // Read the prompt from the PROMPT.MD file
    const promptPath = path.join(process.cwd(), 'docs', 'PROMPT.MD');
    const promptText = fs.readFileSync(promptPath, 'utf-8');

    const timeframe = params.metadatas?.timeframe || defaultTimeFrame;
    const symbol = params.metadatas?.symbol || 'Unknown Symbol';
    const accountBalance = params.metadatas?.accountBalance || 0;
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const riskPerTrade = 2;
    
    const promptWithContext = promptText
        .replace('${timeframe}', timeframe)
        .replace('${symbol}', symbol)
        .replace('${accountBalance}', accountBalance.toString())
        .replace('${date}', date)
        .replace('${riskPerTrade}', riskPerTrade.toString());
    
    // Log image data info for debugging
    console.log('Image data start:', params.metadatas?.imageUrl?.substring(0, 100));
    console.log('Image data length:', params.metadatas?.imageUrl?.length);

    const result = await generateText({
        model: xai.responses('grok-4-1-fast-reasoning'),
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'image', image: params.metadatas?.imageUrl },
                    { 
                        text: `CRITICAL: You must analyze the ACTUAL image I'm sending you. Read the exact current price from the chart display.
${promptWithContext}

IMPORTANT: 
- First, identify the EXACT current price shown on the chart (look at price labels on the right side)
- Do not make up prices - use only what you see in the actual chart
- Verify your prices match the chart before responding`, 
                        type: 'text' 
                    },
                ],
            },
        ],
    });

    console.log('Prompt text', promptWithContext);
    console.log('Prompt messages:', [
        {
            role: 'user',
            content: [
                { type: 'image', image: params.metadatas?.imageUrl },
                { text: promptWithContext, type: 'text' },
            ],
        },
    ]);

    console.log('AI Response:', result.text);

    return {
        text: '',
        json: result.text ? JSON.parse(result.text) : {
            tradeDirection: 'LONG',
            entryPrice: 1.2150,
            confidence: 0.85,
            rationale: 'The chart shows a strong uptrend with higher highs and higher lows, indicating bullish momentum.',
            stopLoss: 1.2000,
            takeProfit: 1.2500,
            keySupportResistanceLevels: [1.2100, 1.2200, 1.2300],
            winratePercentage: 75,
            riskRewardRatio: [1, 2],
        },
    }
}
