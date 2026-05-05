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