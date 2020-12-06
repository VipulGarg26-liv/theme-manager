import express from 'express';
import { createCampaign, getAllCampaigns, updateCampaign } from '../controllers/campaignControllers.js';

const router = express.Router();

router.get('/campaigns', getAllCampaigns);
router.post('/campaigns', createCampaign);
// router.get('/campaigns/:campaignId', getAllSources);
router.put('/campaigns/:campaignId', updateCampaign);

export default router;