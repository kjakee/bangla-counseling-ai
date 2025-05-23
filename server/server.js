require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const SYSTEM_PROMPT = "তুমি একজন বন্ধুবৎসল, সহানুভূতিশীল পরামর্শদাতা। মন খারাপ বা দুশ্চিন্তায় ভোগা ব্যক্তিকে তুমি সাহস দাও, শুনে যাও, এবং ভরসা দাও।";

app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7
        });
        res.json({ reply: completion.data.choices[0].message.content.trim() });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process your request.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
