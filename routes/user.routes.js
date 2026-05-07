import express from "express";
import { getConsumerProfile, updateConsumerProfile } from "../controllers/consumerController.js";
import { getMarketProfile, updateMarketProfile } from "../controllers/marketController.js";
import { requireMarket, requireConsumer } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CONSUMER PROFILE ROUTES - mounted requireConsumer middleware to all routes starting with /profile to ensure only consumers can access these routes
router.use('/profile', requireConsumer);

router.get('/profile', getConsumerProfile);
router.post('/profile/edit', updateConsumerProfile);

// MARKET PROFILE ROUTES - mounted requireMarket middleware to all routes starting with /dashboard/profile to ensure only markets can access these routes
router.use('/dashboard/profile', requireMarket);

router.get('/dashboard/profile', getMarketProfile);
router.post('/dashboard/profile/edit', updateMarketProfile);

export default router;