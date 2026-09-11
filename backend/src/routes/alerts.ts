import { Router } from 'express';
import { getAlerts } from '../data/dataSourceAdapter';

const router = Router();

router.get('/', (_req, res) => res.json(getAlerts()));

export default router;
