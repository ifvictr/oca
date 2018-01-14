const config = require("../config");
const router = require("express").Router();

/*
 * GET /
 * Render homepage
 */
router.get("/", (req, res) => {
    res.render("index", {
        domain: config.app.domain,
        name: config.app.name
    });
});

/*
 * GET /{id}
 * Redirect record ids to original URLs
 */
router.get("/:id", (req, res, next) => {
    next();
});

module.exports = router;