import { Router } from 'express';
import { getGridHistory } from '../data/dataSourceAdapter';

const router = Router();

router.get('/', (_req, res) => res.json(getGridHistory(48)));

export default router;
