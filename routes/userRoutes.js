const router = require("express").Router();
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 3,
});

const { checkToken } = require("../auth/tokenValidation");
const {
	createUser,
	login,
	getUsers,
} = require("../controllers/userController");
router.get("/", checkToken, getUsers);
router.post(
	"/",
	[
		body("email", "Please enter a valid email").isEmail().normalizeEmail(),
		body(
			"password",
			"Please enter a password greater than or equal to 8 characters"
		).isLength({ min: 8 }),
		body("first_name", "Please enter your firstname").notEmpty().trim(),
		body("last_name", "Please enter your lastname").trim(),
	],
	createUser
);

router.post(
	"/login",
	loginLimiter,
	[
		body("email", "Please enter a valid email").isEmail().normalizeEmail(),
		body("password", "Please enter a password!").notEmpty(),
	],
	login
);

module.exports = router;
