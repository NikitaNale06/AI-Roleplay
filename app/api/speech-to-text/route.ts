import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audio } = req.body;

    // Send to Whisper model for transcription
    const response = await fetch('http://localhost:3000/api/huggingface/openai/whisper-large-v3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: audio, // Base64 encoded audio
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.status(200).json({
      text: result.text,
      words: result.text.split(/\s+/).filter((word: string) => word.length > 0),
      duration: result.duration,
    });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
}