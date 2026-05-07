import { getProduct } from "../controllers/productController.js";

/**
 * This middleware checks if the user is authenticated by verifying the presence of a user object in the session. 
 * If the user is not authenticated, it responds with a 401 Unauthorized status and an error message.
 * If the user is authenticated, it allows the request to proceed to the next middleware or route handler.
 * We handle both 401 and 403 errors.
 */

export const requireMarket = (req, res, next) => {
    const user = req.session.user; // take user info from session
    if(!user) {
        req.session.status = { isSuccess: false, msg: "Please log in to access that page." };
        return res.redirect("/"); // 401 Unauthorized

    }
    if(user.type !== 'market') {
        req.session.status = { isSuccess: false, msg: "You are not allowed to access that page." };
        return res.redirect("/"); // 403 Forbidden
    }
    next(); // allow the request to proceed to the next middleware or route handler
}

export const requireConsumer = (req, res, next) => {
    const user = req.session.user;
    if(!user) {
        req.session.status = { isSuccess: false, msg: "Please log in to access that page." };
        return res.redirect("/");
    }
    if(user.type !== 'consumer') {
        req.session.status = { isSuccess: false, msg: "You are not allowed to access that page." };
        return res.redirect("/");
    }
    next();
}

/**
 * This middleware checks if the current market owns the product they're trying to access.
 * Extracts product ID from route params, verifies ownership, and blocks access if not the owner.
 */
export const requireProductOwnership = async (req, res, next) => {
    try {
        const { id } = req.params;
        const marketID = req.session.userId;

        const product = await getProduct(id);

        if (!product || product.marketID !== marketID) {
            req.session.status = { isSuccess: false, msg: "You do not have permission to access this product." };
            return res.status(403).redirect("/dashboard");
        }
        next();
    } catch (error) {
        req.session.status = { isSuccess: false, msg: "Error verifying product access." };
        return res.status(500).redirect("/dashboard");
    }
}