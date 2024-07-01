const { Router } = require('express');
const { preferencesController } = require('../controllers/preferencesController');

const preferenceRouter = Router();

preferenceRouter.get('/', preferencesController.getPreferences);
preferenceRouter.get('/:username', preferencesController.getPreferenceByUserName);

module.exports = { preferenceRouter };