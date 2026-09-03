const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client using environment variable API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getAiBusinessInsights = async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt || "Analyze SR Electronics Park inventory and provide a short business growth tip for Salsabilah Empire POS.",
        });

        res.status(200).json({
            success: true,
            insight: response.text
        });
    } catch (err) {
        console.error('Gemini API Error:', err.message);
        res.status(500).json({ success: false, error: 'Failed to generate AI insight' });
    }
};

module.exports = { getAiBusinessInsights };
