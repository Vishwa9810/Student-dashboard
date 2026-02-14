
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeNote = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Please provide a concise, bulleted summary of these lecture notes:\n\n${content}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "An error occurred while summarizing.";
  }
};

export const getProductivityAdvice = async (data: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this student workload data: ${JSON.stringify(data)}. Provide 3 personalized, actionable productivity tips. Keep it short and motivating.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Stay focused and keep going!";
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "Consistency is key to academic success!";
  }
};
