const { hash, genSalt, compare } = require("bcrypt");
const { validationResult } = require("express-validator");
const { sign } = require("jsonwebtoken");
const {
	create,
	getUserByUserEmail,
	getUserByUserId,
	getUsers,
	updateUser,
	deleteUser,
} = require("../models/userModel");

module.exports = {
	createUser: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const body = req.body;
			const checkUser = await getUserByUserEmail(body.email);
			if (checkUser.length > 0) {
				return res.status(409).json({
					errors: [{ msg: "User Alredy Exist", param: "email" }],
				});
			}
			const salt = await genSalt(10);
			body.password = await hash(body.password, salt);
			const result = await create(body);

			return res.json({
				success: 1,
				data: result,
			});
		} catch (err) {
			console.error(err);
		}
	},
	login: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const body = req.body;
			const user = await getUserByUserEmail(body.email);
			if (user.length > 0) {
				const result = await compare(body.password, user[0].pass);
				if (result) {
					user[0].pass = undefined;
					const jsontoken = sign({ result: user }, process.env.JWT_KEY, {
						expiresIn: "1h",
					});
					return res.json({
						success: 1,
						message: "login successfully",
						token: jsontoken,
					});
				} else {
					return res.json({
						success: 0,
						data: "Invalid email or password",
					});
				}
			} else {
				return res.json({
					success: 0,
					data: "Invalid email or password",
				});
			}
		} catch (err) {
			console.error(err);
		}
	},
	getUsers: async (req, res) => {
		try {
			const user = await getUsers();
			return res.json({
				success: 1,
				data: user,
			});
		} catch (err) {
			console.error(err);
		}
	},
};
