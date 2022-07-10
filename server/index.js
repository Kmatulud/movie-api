const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoute = require("./routes/routes");

app.use("/api", authRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log("app listening on port", PORT);
});
