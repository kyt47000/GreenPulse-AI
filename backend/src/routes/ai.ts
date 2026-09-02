import { Router } from 'express';
import { getAIResponse } from '../agents/dashboardAgent';

const router = Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const response = await getAIResponse(message);
    res.json({
      content: response.content,
      source: response.source,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'AI service error', details: err.message });
  }
});

export default router;
