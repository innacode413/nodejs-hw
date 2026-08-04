const { Router } = require('express');
const { createOrder, getOrders, getOrder, updateStatus } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', roleMiddleware('admin'), updateStatus);

module.exports = router;
