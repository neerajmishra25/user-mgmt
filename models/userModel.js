const pool = require("../config/db");

module.exports = {
	create: (data) => {
		try {
			const res = pool.query(`CALL addUsers(?,?,?,?)`, [
				data.first_name,
				data.last_name,
				data.email,
				data.password,
			]);
			return res;
		} catch (error) {
			console.error(error);
		}
	},
	getUserByUserEmail: async (email) => {
		const res = await pool.query(`CALL getUserByEmail(?)`, [email]);
		return res[0];
	},

	getUsers: () => {
		const users = pool.query(`CALL selectUsers()`);
		return users;
	},
};
