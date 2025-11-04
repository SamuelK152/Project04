const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/questionController');

router.get('/', auth, ctrl.listByCategory);

module.exports = router;