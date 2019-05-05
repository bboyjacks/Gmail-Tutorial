var express = require("express");
var path = require("path");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.sendFile(path.join(__dirname, "/../views/index.html"));
});

router.get("/_login", (req, res) => {
  res.sendFile(path.join(__dirname, "/../views/_login.html"));
});

module.exports = router;
