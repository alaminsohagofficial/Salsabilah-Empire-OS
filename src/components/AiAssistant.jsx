import React, { useState } from 'react';
import axios from 'axios';

const AiAssistant = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAskAi = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/ai/insights', { prompt });
            setResponse(res.data.insight);
        } catch (err) {
            console.error(err);
            setResponse('Error communicating with Gemini AI.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-xl text-slate-100 max-w-md shadow-lg">
            <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                👑 Salsabilah Gemini AI Assistant
            </h3>
            <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AI about sales trend, stock, or business tips..."
                className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm mb-2 text-slate-100 resize-none h-20"
            />
            <button 
                onClick={handleAskAi}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1.5 rounded text-sm transition"
            >
                {loading ? 'Analyzing with Digit Theory...' : 'Ask Gemini AI'}
            </button>

            {response && (
                <div className="mt-3 bg-slate-950 p-3 rounded border border-slate-800 text-xs text-sky-300 leading-relaxed">
                    <strong>AI Response:</strong> {response}
                </div>
            )}
        </div>
    );
};

export default AiAssistant;
