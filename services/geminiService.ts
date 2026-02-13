
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const chatWithAI = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are the friendly AI assistant for this personal website. Speak concisely, use emojis, and be helpful as 'The Crew'. Your tone is cool, modern, and energetic.",
    },
  });
  
  const result = await chat.sendMessage({ message });
  return result.text;
};

export const getQnaAnswer = async (question: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: question,
    config: {
      systemInstruction: "You are 'The Crew', answering questions for a fan on a personal bio site. Keep answers under 2 sentences and use an informal, friendly vibe.",
    }
  });
  return response.text;
};

export const getVideosFromSearch = async () => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Find the 5 most recent videos from the YouTube channel '@kabutcraft'. Return them as a JSON array of objects with 'title' and 'url' properties. Just the JSON, no markdown formatting.",
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING }
          },
          required: ["title", "url"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse video list", e);
    return [];
  }
};
