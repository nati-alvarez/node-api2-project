const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    res.send("posts index route");
})

module.exports = router;