import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const geminiResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            }
        );
        const data = await geminiResponse.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand.";

        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
