const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/answerController');

router.get('/', auth, ctrl.listByQuestion);
router.post('/', auth, ctrl.create);
router.post('/:id/comments', auth, ctrl.addComment);
router.delete('/:id', auth, ctrl.remove);
router.delete('/:answerId/comments/:commentId', auth, ctrl.removeComment);

module.exports = router;