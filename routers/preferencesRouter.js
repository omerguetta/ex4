const { Router } = require('express');
const { preferencesController } = require('../controllers/preferencesController');

const preferenceRouter = Router();

preferenceRouter.get('/', preferencesController.getPreferences);
preferenceRouter.get('/preferences_result', preferencesController.getPreferencesResult);
preferenceRouter.get('/:username', preferencesController.getPreferenceByUserName);
preferenceRouter.post('/:username', preferencesController.addPreference);
preferenceRouter.put('/:username', preferencesController.updatePreference);

module.exports = { preferenceRouter };