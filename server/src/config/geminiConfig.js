import { GoogleGenerativeAI } from "@google/generative-ai";

console.log(process.env.GEMINI_KEY);

if (!process.env.GEMINI_KEY) {
    console.error("❌ Invalid GEMINI_KEY!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
})