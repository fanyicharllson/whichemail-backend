import { Request, Response } from "express";
import axios from "axios";
import { COMPANY_CONTEXT } from '../utils/ai-context';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';


export const chatWithAI = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ 
      success: false,
      message: 'Message is required' 
    });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ 
      success: false,
      message: 'API key not configured! Please contact Charllson to fix this.' 
    });
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `${COMPANY_CONTEXT}\n\nUser question: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }
    );

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('Invalid response from AI');
    }

    return res.json({
      success: true,
      response: aiResponse
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to get AI response. Please try again.'
    });
  }
};