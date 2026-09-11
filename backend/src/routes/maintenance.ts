import { Router } from 'express';
import { getMaintenanceRecords } from '../data/dataSourceAdapter';

const router = Router();

router.get('/', (_req, res) => res.json(getMaintenanceRecords()));

export default router;
