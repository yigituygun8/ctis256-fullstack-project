import express from "express";
import { getConsumerProfile, updateConsumerProfile } from "../controllers/consumerController.js";
import { getMarketProfile, updateMarketProfile } from "../controllers/marketController.js";
import { requireMarket, requireConsumer } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CUSTOMER PROFILE ENDPOINTS
// GET /profile - customer profile page
router.get('/profile', requireConsumer, getConsumerProfile);
    
// POST /profile/edit - update customer profile
router.post('/profile/edit', requireConsumer, updateConsumerProfile);

// MARKET PROFILE ENDPOINTS
// GET /dashboard/profile - market profile page
router.get('/dashboard/profile', requireMarket, getMarketProfile);

// POST /dashboard/profile/edit - update market profile
router.post('/dashboard/profile/edit', requireMarket, updateMarketProfile);

export default router;