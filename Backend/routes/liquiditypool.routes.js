const express = require("express");
const { getSingleSellRequest,getSellRequests, postSellRequests, mySellRequests, buyTokens, deleteSellRequest }=require("../controllers/liquiditypool.controller.js")
const router = express.Router();

router.post("/sell-request", postSellRequests);
router.get("/:tokenAddress/:seller", getSingleSellRequest);
router.get("/sell-requests", getSellRequests);
router.post("/buy-tokens", buyTokens);
router.get("/my-sell-requests/:seller", mySellRequests);
router.delete("/delete",deleteSellRequest);

module.exports = router;
