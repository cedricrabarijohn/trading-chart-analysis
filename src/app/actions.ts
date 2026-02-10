'use server';

import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';

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
}

export async function analyzeImage(params: AnalyzeImageRequest): Promise<AnalyzeImageResponse> {
    const defaultTimeFrame = '15mn';
    // Read the prompt from the PROMPT.MD file
    const promptPath = path.join(process.cwd(), 'docs', 'PROMPT.MD');
    const promptText = fs.readFileSync(promptPath, 'utf-8');

    const timeframe = params.metadatas?.timeframe || defaultTimeFrame;
    const symbol = params.metadatas?.symbol || 'Unknown Symbol';
    const accountBalance = params.metadatas?.accountBalance || 0;
    const promptWithContext = promptText.replace('${timeframe}', timeframe).replace('${symbol}', symbol).replace('${accountBalance}', accountBalance.toString());

    const messages = [
        {
            role: 'system',
            content: promptWithContext,
        },
        {
            role: 'user',
            content: [
                { type: 'image', image: params.metadatas?.imageUrl },
                { text: 'Analyze this chart', type: 'text' },
            ],
        },
    ];

    //   const result = await generateText({
    //     model: xai.responses('grok-4-1-fast-non-reasoning'),
    //     messages: [
    //       {
    //         role: 'system',
    //         content: promptText,
    //       },
    //       {
    //         role: 'user',
    //         content: [
    //           { type: 'image', image: imageUrl },
    //           { text: 'Analyze this chart', type: 'text' },
    //         ],
    //       },
    //     ],
    //   });

    //   console.log(result.text);
    //   return result.text;
    return { text: messages.map(msg => JSON.stringify(msg)).join('\n') };
}
