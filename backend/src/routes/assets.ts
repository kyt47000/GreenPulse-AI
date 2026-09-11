import { Router } from 'express';
import { getAssets, getAssetById } from '../data/dataSourceAdapter';

const router = Router();

router.get('/', (_req, res) => res.json(getAssets()));
router.get('/:id', (req, res) => {
  const asset = getAssetById(req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  res.json(asset);
});

export default router;
