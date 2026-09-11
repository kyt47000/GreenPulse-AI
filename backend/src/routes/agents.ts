import { Router } from 'express';
import { getAgents } from '../data/dataSourceAdapter';

const router = Router();

router.get('/', (_req, res) => res.json(getAgents()));

export default router;
