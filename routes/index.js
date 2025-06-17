const router = require("express").Router();
const { createHealthPage } = require("../helpers/server.helper");
const apiRoutes = require("./api.routes");





router.get('/', (req, res) => {
    res.send(createHealthPage());
});

router.use("/api", apiRoutes);
router.use((req, res) => {
    res.status(404).send("<h1>😝 404 Error!</h1>");
});

module.exports = router;