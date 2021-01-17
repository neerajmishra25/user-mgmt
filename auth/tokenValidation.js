const jwt = require("jsonwebtoken");
module.exports = {
	checkToken: async (req, res, next) => {
		let token = req.get("authorization");
		if (token) {
			// Remove Bearer from string
			token = token.slice(7);
			jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
				if (err) {
					return res.json({
						success: 0,
						message: "Invalid Token...",
					});
				} else {
					if (decoded.result[0].role === "admin") {
						next();
					} else {
						return res.status(401).json({
							success: 0,
							message: "Access Denied! Action not allowed",
						});
					}
				}
			});
		} else {
			return res.status(401).json({
				success: 0,
				message: "Access Denied! Unauthorized User",
			});
		}
	},
};
