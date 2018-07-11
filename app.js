var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
require("dotenv").config();

var index = require("./js/index");

var app = express();
app.set("env", process.env.ENV || "development");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("views",path.join(__dirname, "views"));
app.set("view engine", "hbs");
var sess = {
	secret: 'supersecret',
	cookie: { maxAge: 24*60*60*1000 },
	resave: true,
	saveUninitialized: true,
	name: "puzzle-session"
}
if (app.get("env") === "production") {
	app.set("trust proxy", 1);
	sess.cookie.secure = true;
}
app.use(session(sess));

app.use("/", index);

app.use(function(req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
