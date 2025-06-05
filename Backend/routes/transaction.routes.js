const express = require("express");
const { getTransaction, setTransaction, deleteAllContracts } = require("../controllers/transaction.controller.js");

const router = express.Router();

router.route("/:walletID").get(getTransaction);
router.route("/set").post(setTransaction);
router.route("/delAll").delete(deleteAllContracts);

module.exports = router;
