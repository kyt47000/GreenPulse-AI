import { Router } from 'express';
import { alertsData } from '../data/mockData';

const router = Router();
router.get('/', (_req, res) => res.json(alertsData));
export default router;
