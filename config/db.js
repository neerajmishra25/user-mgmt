const { createPool } = require("mysql");
const util = require("util");
const pool = createPool({
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	connectionLimit: 10,
});
// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
	if (err) {
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			console.error("Database connection was closed.");
		}
		if (err.code === "ER_CON_COUNT_ERROR") {
			console.error("Database has too many connections.");
		}
		if (err.code === "ECONNREFUSED") {
			console.error("Database connection was refused.");
		}
	}
	if (connection) connection.release();
	return;
});
pool.query = util.promisify(pool.query);

module.exports = pool;
