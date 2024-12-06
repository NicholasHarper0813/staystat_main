const router = require('express').Router();


const getSignature = require('../controllers/fileController');
router.post('/signature/get-sign',getSignature);

module.exports = router;