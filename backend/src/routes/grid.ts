import { Router } from 'express';
import { getGridData } from '../data/mockData';

const router = Router();
router.get('/', (_req, res) => res.json(getGridData(48)));
export default router;
