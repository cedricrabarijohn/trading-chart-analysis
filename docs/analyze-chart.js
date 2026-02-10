#!/usr/bin/env node
/*
  Usage:
    OPENAI_API_KEY=... node analyze-chart.js /path/to/chart.png
    OPENAI_API_KEY=... node analyze-chart.js /path/to/chart.png "Optional prompt"
*/

const fs = require("fs");
const path = require("path");

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY env var.");
  process.exit(1);
}

const imagePath = process.argv[2];
if (!imagePath) {
  console.error("Usage: node analyze-chart.js /path/to/chart.png [optional prompt]");
  process.exit(1);
}

const userPrompt = process.argv.slice(3).join(" ");
const promptPath = path.join(__dirname, "PROMPT.MD");
const defaultPrompt = fs.existsSync(promptPath)
  ? fs.readFileSync(promptPath, "utf8").trim()
  : "Analyze this trading chart image. Identify key support/resistance levels, momentum/volume clues if visible, and any clear chart patterns. Based on the current price action, suggest reasonable stop loss and take profit positions. Provide a concise, technical summary with specific price levels for stop loss and take profit.";
const prompt = userPrompt || defaultPrompt;

const imageBuffer = fs.readFileSync(imagePath);
const imageExt = path.extname(imagePath).slice(1).toLowerCase() || "png";
const base64Image = imageBuffer.toString("base64");

async function main() {
  const body = {
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          {
            type: "input_image",
            image_url: `data:image/${imageExt};base64,${base64Image}`,
          },
        ],
      },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("OpenAI API error:", res.status, errText);
    process.exit(1);
  }

  const data = await res.json();
  const outputText = data.output_text || "";

  if (!outputText) {
    console.log("No text output returned.");
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(outputText.trim());
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
