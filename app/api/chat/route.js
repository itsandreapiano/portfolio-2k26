import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const MODEL = "gemini-3.5-flash-lite";

const MAX_MESSAGES = 20;
const MAX_USER_MESSAGE_LENGTH = 3000;
const MAX_ASSISTANT_MESSAGE_LENGTH = 4000;
const MAX_TOTAL_CONVERSATION_LENGTH = 30000;

const PROMPT_PATH = path.join(
  process.cwd(),
  "src",
  "lib",
  "AIChatbotPrompt.md",
);

// Load the chatbot's system prompt.
async function getSystemPrompt() {
  const prompt = await readFile(PROMPT_PATH, "utf8");

  if (!prompt.trim()) {
    throw new Error("AI chatbot system prompt is empty.");
  }

  return prompt;
}

// API health check.
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Andrea AI API is running.",
    configured: Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY),
  });
}

// Handle chatbot messages.
export async function POST(request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 503 },
      );
    }

    // Parse the request.
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 },
      );
    }

    const messages = body?.messages;

    // Validate conversation structure and lengths.
    const isValidConversation =
      Array.isArray(messages) &&
      messages.length > 0 &&
      messages.length <= MAX_MESSAGES &&
      messages.every((message, index) => {
        if (
          !message ||
          typeof message !== "object" ||
          !["user", "assistant"].includes(message.role) ||
          typeof message.content !== "string" ||
          !message.content.trim()
        ) {
          return false;
        }

        const expectedRole = index % 2 === 0 ? "user" : "assistant";

        if (message.role !== expectedRole) {
          return false;
        }

        const maxLength =
          message.role === "user"
            ? MAX_USER_MESSAGE_LENGTH
            : MAX_ASSISTANT_MESSAGE_LENGTH;

        return message.content.length <= maxLength;
      }) &&
      messages[messages.length - 1].role === "user" &&
      messages.reduce((total, message) => total + message.content.length, 0) <=
        MAX_TOTAL_CONVERSATION_LENGTH;

    if (!isValidConversation) {
      return NextResponse.json(
        {
          error: "Invalid conversation or message length exceeded.",
        },
        { status: 400 },
      );
    }

    // Load professional information.
    const systemPrompt = await getSystemPrompt();

    // Initialize Gemini.
    const ai = new GoogleGenAI({ apiKey });

    // Convert messages to Gemini format.
    const contents = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    // Generate a response.
    const result = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        maxOutputTokens: 800,
      },
    });

    const reply = result.text?.trim();

    if (!reply) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown Gemini API error";

    const status = typeof error?.status === "number" ? error.status : 500;

    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "The AI assistant is temporarily unavailable. Please try again later.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate AI response.",
        ...(process.env.NODE_ENV === "development" ? { details: message } : {}),
      },
      {
        status: status >= 400 && status < 600 ? status : 500,
      },
    );
  }
}
