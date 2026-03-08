import { Chat } from "../models/Chat.model.js";
import { translateMessage } from "../services/translate.servise.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSmartTranslation = asyncHandler(async (req, res) => {

    let { text, targetLang, senderId, receiverId } = req.body;

    console.log("📩 Incoming text:", text);

    // 1️⃣ Basic validation
    if (!text) {
        return res.status(400).json(
            new ApiResponse(400, null, "Text is required")
        );
    }

    // 2️⃣ Check if translation already exists
    const existingChat = await Chat.findOne({
        originalMessage: text,
        targetLang: targetLang
    });

    if (existingChat) {
        console.log("🚀 Translation fetched from DB");
        return res.status(200).json(
            new ApiResponse(
                200,
                { translatedText: existingChat.translatedMessage },
                "✅ Fetched from DB"
            )
        );
    }

    // 3️⃣ Gemini AI call
    console.log("🧠 Gemini AI call is running...");
    const translatedText = await translateMessage(text, targetLang);

    // 4️⃣ Agar receiverId empty ho to DB save skip karo
    if (!receiverId) {
        console.log("⚠️ receiverId missing → skipping DB save");

        return res.status(200).json(
            new ApiResponse(
                200,
                { translatedText },
                "✅ Translated (not saved)"
            )
        );
    }

    // 5️⃣ DB me save
    const newChat = await Chat.create({
        senderId,
        receiverId,
        originalMessage: text,
        translatedMessage: translatedText,
        targetLang
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            { translatedText: newChat.translatedMessage },
            "✅ Translated and Saved"
        )
    );

});