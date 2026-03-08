import { model } from "../config/geminiConfig.js";

export const translateMessage = async (text, targetLang) => {

    if (!text || text.length < 2) return text;

    try {

        const prompt = `
        Translate the following text to ${targetLang}.
        Only return the translated sentence.
        Text: ${text}
        `;

        const result = await model.generateContent(prompt);

        const response = result.response;

        // Safe parsing
        const translated =
            response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!translated) {
            console.log("⚠️ Gemini returned empty text");
            return text;
        }

        return translated;

    } catch (error) {

        console.error("🚨 Gemini Error:", error.message);

        // fallback taaki demo break na ho
        return `[${targetLang}] ${text}`;
    }
};