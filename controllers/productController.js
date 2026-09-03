const { getProducts, addProduct } = require('../controllers/productController');

// Product & Inventory Routes
router.get('/products', getProducts);
router.post('/products', addProduct);
