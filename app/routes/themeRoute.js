import express from 'express';
import { createNewTheme, getAllThemes, getThemeInfo, updateTheme } from '../controllers/themeControllers.js';

const router = express.Router();

router.get('/themes', getAllThemes);
router.post('/themes', createNewTheme);
router.put('/themes/:themeId', updateTheme);
router.get('/themes/:themeId', getThemeInfo);

export default router;