import { Router } from 'express';
import { getCurrentWeather, getWeatherHistory } from '../data/dataSourceAdapter';

const router = Router();

router.get('/',        (_req, res) => res.json(getWeatherHistory(48)));
router.get('/current', (_req, res) => res.json(getCurrentWeather()));

export default router;
