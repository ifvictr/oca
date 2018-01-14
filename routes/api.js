const router = require("express").Router();

/*
 * POST /api/create
 * Creates a new record
 */
router.post("/create", (req, res) => {
    require("../helpers/recordManager").create(req.body.url);
    res.status(200).send(''); // todo
});

/*
 * POST /api/exists
 * Checks if a record exists
 */
router.post("/exists", (req, res) => {
    
});

module.exports = router;