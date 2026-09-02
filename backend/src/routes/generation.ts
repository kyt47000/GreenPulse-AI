import { Router } from 'express';
import { getGenerationHistory, getGenerationForecast } from '../data/mockData';

const router = Router();
router.get('/history', (_req, res) => res.json(getGenerationHistory(72)));
router.get('/forecast', (_req, res) => res.json(getGenerationForecast(72)));
export default router;
