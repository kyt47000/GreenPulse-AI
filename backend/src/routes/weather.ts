import { Router } from 'express';
import { getWeatherData } from '../data/mockData';

const router = Router();
router.get('/', (_req, res) => res.json(getWeatherData(48)));
router.get('/current', (_req, res) => res.json(getWeatherData(1)[0]));
export default router;
