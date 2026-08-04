const { Router } = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authMiddleware, roleMiddleware('admin'), create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), remove);

module.exports = router;
