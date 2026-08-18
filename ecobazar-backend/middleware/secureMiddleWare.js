const jwt = require("jsonwebtoken");

const secureMiddleWare = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({
                success: false,
                message: "Authorization token is required",
            });
        }

        const token = authHeader.startsWith("Bearer ") ?
            authHeader.split(" ")[1] :
            authHeader;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Invalid authorization token",
            });
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        success: false,
                        message: "Unauthorized",
                    });
                }

                req.user = decoded;

                next();
            }
        );

    } catch (error) {
        console.error("Authentication Error:", error);

        return res.status(500).send({
            success: false,
            message: "Something went wrong",
        });
    }
};

module.exports = secureMiddleWare;