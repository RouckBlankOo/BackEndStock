const router = require("express").Router();
const userRoutes = require("../features/user/user.routes");
const categoryRoutes = require("../features/category/category.routes");
const productRoutes = require("../features/product/product.routes");
const statsRoutes = require("../features/stats/stats.routes");



router.use("/category", categoryRoutes);
router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/stats", statsRoutes);





module.exports = router;
