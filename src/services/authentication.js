const jwt = require("jsonwebtoken");

module.exports = {
    authCheck: (req, res, next) => {
        let token = req.get("authorization");

        if (token) {
            token = token.slice(7);
            jwt.verify(token, "qwe1234", (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        // Handle token expiration
                        return res.status(401).json({
                            success: false,
                            message: "Token expired",
                        });
                    }
                    // Handle other verification errors
                    return res.status(401).json({
                        success: false,
                        message: "Invalid token",
                    });
                } else {
                    next();
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Access denied! Unauthorized user",
            });
        }
    },
};
