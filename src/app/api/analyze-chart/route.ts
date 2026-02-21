import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export interface AnalyzeChartDatasRequest {
  metadatas: {
    chartDatas: string;
    symbol?: string;
    timeframe?: string;
    accountBalance?: number;
  };
}

export interface IAnalysisResult {
  tradeDirection: 'LONG' | 'SHORT';
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  confidence: number;
  rationale?: string;
  keySupportResistanceLevels?: number[];
  winratePercentage?: number;
  riskRewardRatio?: number;
}

export interface AnalyzeChartDatasResponse {
  text: string;
  json?: IAnalysisResult;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeChartDatasRequest = await request.json();
    const defaultTimeFrame = '15mn';

    // Read the prompt from the PROMPT.MD file
    const promptPath = path.join(process.cwd(), 'docs', 'PROMPT.MD');
    const promptText = fs.readFileSync(promptPath, 'utf-8');

    const chartDatas = body.metadatas.chartDatas ? JSON.parse(body.metadatas.chartDatas) : null;
    const timeframe = body.metadatas?.timeframe || defaultTimeFrame;
    const symbol = body.metadatas?.symbol || 'Unknown Symbol';
    const accountBalance = body.metadatas?.accountBalance || 0;
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            },
          ],
        },
      ],
    });

    const jsonResult = result.text.match(/{[\s\S]*}/);
    let analysisResult: IAnalysisResult | undefined;

    if (jsonResult) {
      try {
        analysisResult = JSON.parse(jsonResult[0]);
        console.log('Parsed Analysis Result:', analysisResult);
      } catch (error) {
        console.error('Error parsing JSON from result:', error);
      }
    } else {
      console.warn('No JSON result found in the response text.');
    }

    const response: AnalyzeChartDatasResponse = {
      text: result.text,
      json: analysisResult,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in analyze-chart API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze chart data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
