import { Router } from 'express';
import { maintenanceRecords } from '../data/mockData';

const router = Router();
router.get('/', (_req, res) => res.json(maintenanceRecords));
export default router;
