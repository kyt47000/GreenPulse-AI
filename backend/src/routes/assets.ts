import { Router } from 'express';
import { assets } from '../data/mockData';

const router = Router();

router.get('/', (_req, res) => res.json(assets));
router.get('/:id', (req, res) => {
  const asset = assets.find(a => a.assetId === req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  res.json(asset);
});

export default router;
