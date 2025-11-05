// pages/api/submitMission.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { text, prompt } = req.body;

  if (!text || !prompt) {
    return res.status(400).json({ success: false, error: 'Missing text or prompt' });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: text }
      ]
    });

    const feedback = chatCompletion.choices[0].message?.content;
    res.status(200).json({ success: true, feedback });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
