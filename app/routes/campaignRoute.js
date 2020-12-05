import express from 'express';
import { getAllSources } from '../controllers/sourceControllers.js';

const router = express.Router();

router.get('/campaigns', getAllSources);
router.post('/campaigns', getAllSources);
router.get('/campaigns/:campaignId', getAllSources);
router.put('/campaigns/:campaignId', getAllSources);

export default router;