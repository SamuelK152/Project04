const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/categoryController');

router.get('/', auth, ctrl.list);

module.exports = router;