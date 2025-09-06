// backend/src/routes/market.ts
import express from 'express';
import { analyzeMarket } from '../controllers/marketController';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

router.post('/analyze',
  [
    body('sourceState').notEmpty().withMessage('Source state is required'),
    body('targetState').notEmpty().withMessage('Target state is required'), 
    body('product').notEmpty().withMessage('Product is required')
  ],
  validateRequest,
  analyzeMarket
);

export default router;