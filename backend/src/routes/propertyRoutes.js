const router = require('express').Router();
const ctrl = require('../controllers/propertyController');
const { authenticate } = require('../middleware/auth');

router.get('/', ctrl.getAllProperties);
router.get('/mine', authenticate, ctrl.getMyProperties);
router.get('/:id', ctrl.getPropertyById);
router.post('/', authenticate, ctrl.createProperty);
router.put('/:id', authenticate, ctrl.updateProperty);
router.delete('/:id', authenticate, ctrl.deleteProperty);

module.exports = router;
