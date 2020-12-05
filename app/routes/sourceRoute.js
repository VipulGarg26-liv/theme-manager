import express from 'express';
import { createSource, getAllSources, getSourceInfo, updateSource } from '../controllers/sourceControllers.js';

const router = express.Router();

router.get('/sources', getAllSources);
router.post('/sources', createSource);
router.put('/sources/:sourceId', updateSource);
router.get('/sources/:sourceId', getSourceInfo);

export default router;