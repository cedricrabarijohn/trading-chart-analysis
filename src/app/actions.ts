'use server';

import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';
import { IAnalysisResult } from './app';

export interface AnalyzeChartDatasRequest {
    metadatas: {
        chartDatas: string;
        symbol?: string; // eg : 'GBP/USD'
        timeframe?: string; // eg : '1h'
        accountBalance?: number; // eg : 1000
    }
}

export interface AnalyzeChartDatasResponse {
    text: string;
    // json: IAnalysisResult;
}

export async function analyseChartDatas(params: AnalyzeChartDatasRequest): Promise<AnalyzeChartDatasResponse> {
    const defaultTimeFrame = '15mn';
    // Read the prompt from the PROMPT.MD file
    const promptPath = path.join(process.cwd(), 'docs', 'PROMPT.MD');
    const promptText = fs.readFileSync(promptPath, 'utf-8');

    const chartDatas = params.metadatas.chartDatas ? JSON.parse(params.metadatas.chartDatas) : null;
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

    const result = await generateText({
        model: xai.responses('grok-4-1-fast-reasoning'),
        messages: [
            {
                role: 'user',
                content: [
                    {
                        text: `ANALYSE the following CHART DATAS and provide me with a trading recommendation (LONG or SHORT) with entry price, stop loss, take profit, confidence percentage, rationale, key support and resistance levels, winrate percentage and risk-reward ratio.
${chartDatas ? `Here are the chart datas: ${JSON.stringify(chartDatas)}` : 'No chart datas provided.'}`,
                        type: 'text',
                    },
                    {
                        text: promptWithContext,
                        type: 'text',
                    }
                ],
            },
        ],
    });

    console.log('AI Response:', result);

    return {
        text: result.text,
    }
}
