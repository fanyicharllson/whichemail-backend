import { Router } from 'express';
import { chatWithAI } from '../controllers/geminiController';

const router = Router();

router.post('/chat', chatWithAI);

export default router;