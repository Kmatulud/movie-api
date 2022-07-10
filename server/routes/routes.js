const router = require("express").Router();
const bcrypt = require("bcrypt");
const cors = require("cors");

router.use(cors());

const { check, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const PgPromise = require("pg-promise");
const axios = require("axios");
const pgp = PgPromise({});

dotenv.config();

// Db Connect
const DATABASE_URL = process.env.DB_URL;
const config = {
	connectionString: DATABASE_URL,
};
if (process.env.NODE_ENV == "production") {
	config.ssl = {
		rejectUnauthorized: false,
	};
}

const db = pgp(config);
router.get("/movies", async (req, res) => {
	try {
		const { movieName } = req.query;
		const result = await axios.get(
			`https://api.themoviedb.org/3/movie/550?api_key=2fe7760efdb9585fda289007040d9141&query=${movieName}`
		);
		// res.json();
		console.log(result);
	} catch (error) {
		console.log(error);
	}

	// .then(res=>{
	// 	console.log(res);
	// })
});
//Register
router.post("/signup", async (req, res) => {
	try {
		const { username, password } = req.body;
		// check(
		// 	username,
		// 	"Username must be atleast 3 characters and not contain numbers"
		// )
		// 	.isString()
		// 	.isLength({
		// 		min: 3,
		// 	}),
		// 	check(password, "Password must be greater than 6 characters").isLength({
		// 		min: 6,
		// 	});

		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	return res.status(400).json({ errors: errors.array() });
		// }
		bcrypt.hash(password, 10).then(async function (hash) {
			let userDetails = `insert into users (user_name, pass_word) values($1, $2)`;
			await db.none(userDetails, [username, hash]);
		});
		res.json({
			status: "success",
		});
	} catch (err) {
		console.log(err);
		res.json({
			status: "error",
			error: err.message,
		});
	}
});

router.post("/login", async function (req, res) {
	const { password, username } = req.body;

	const user = await db.oneOrNone(`select * from users where user_name=$1`, [
		username,
	]);
	// if (!user) return res.status(400).send("User does not exist");

	const dbPassword = user.pass_word;

	const validPass = await bcrypt.compare(password, dbPassword);
	if (!validPass) return res.status(400).send("Invalid username or password");
	//create and assign token
	const tokenUser = { name: username };
	const token = jwt.sign(tokenUser, process.env.TOKEN_SECRET);

	res.header("access_token", token).send(token);
});

module.exports = router;
