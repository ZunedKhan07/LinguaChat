import { Chat } from "../models/Chat.model.js";
import { translateMessage } from "../services/translate.servise.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSmartTranslation = asyncHandler(async (req, res) => {
    const { text, targetLang, senderId, receiverId } = req.body;

    const existingChat = await Chat.findOne({
        originalMessage: text,
        targetLang: targetLang
    });

    if (existingChat) {
        console.log("🚀 Already Existed!");
        return res.status(200).json(
            new ApiResponse(200, { translatedText: existingChat.translatedMessage }, "✅ Fetched from DB")
        );
    }

    console.log("🧠 Gemini AI call is running...");
    const translatedText = await translateMessage(text, targetLang);

    // 3. DB mein save karo future ke liye
    const newChat = await Chat.create({
        senderId,
        receiverId,
        originalMessage: text,
        translatedMessage: translatedText,
        targetLang: targetLang
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { translatedText: newChat.translatedMessage },
                "✅ Translated and Saved"
            )
    );
});