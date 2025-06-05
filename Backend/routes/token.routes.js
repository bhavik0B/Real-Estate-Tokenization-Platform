const express = require("express");
const { getTokens, addTokens, delTokens, getAllTokens, setLocation ,deleteAllContracts} = require("../controllers/token.controller.js");

const router = express.Router();

router.route("/get/:contractId").get(getTokens);
router.route("/getall").get(getAllTokens);
router.route("/setlocation").post(setLocation);
router.route("/add").post(addTokens);
router.route("/del").post(delTokens);
router.route("/delAll").delete(deleteAllContracts);

module.exports = router;
