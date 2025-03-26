const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createProduct,
  getAllProducts,
  getOwnProducts,
  deleteProduct,
  updateProduct,
  getProductById
} = require('../controllers/productController');

// Public routes (no authentication required)
router.get('/all', getAllProducts);
router.get('/:id', getProductById); // This should be before other routes with parameters

// Protected routes (authentication required)
router.use(auth); // Apply auth middleware to all routes below this
router.post('/create', createProduct);
router.get('/own', getOwnProducts);
router.delete('/delete/:id', deleteProduct);
router.put('/update/:id', updateProduct);

module.exports = router; 