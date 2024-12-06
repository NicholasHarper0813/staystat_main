const router = require('express').Router();
const leadControllers = require('../controllers/leadControllers');


router.post('/leads/create-lead', leadControllers.createLead);
router.get('/leads/get-leads', leadControllers.getLeads);
router.post('/leads/update-lead', leadControllers.updateLead);
router.post('/leads/confirm-lead', leadControllers.confirmLead);
router.get('/leads/get-leads/search', leadControllers.getLeadsBySearch);

module.exports = router;