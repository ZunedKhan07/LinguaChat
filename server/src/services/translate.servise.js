import { model } from "../config/geminiConfig.js";

export const translateMessage = async (text, targetLang) => {

    if (!text || text.length < 4) return text;

    try {
        const prompt = `Translate the following text to ${targetLang}. 
        Provide only the translated text. Do not add any context, quotes, or explanations.
        Text: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const translatedText = response.text().trim();
        
        return translatedText || text;
    } catch (error) {
        console.error("🚨 Translation service error:", error.message);
        return text;
    }
};