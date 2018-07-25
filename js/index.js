var express = require("express");
var router = express.Router();
var rp = require("request-promise");
var crypto = require('crypto');
var code_template = require('./code');
const format = require('string-format');

router.get("/", function(req, res, next) {
	if (!req.session.token) {
		res.redirect(process.env.HOST_SERVICE);
		return;
	}

	res.render("index",{
		code: Buffer.from(format(code_template,...calculateHash(req.session.id).toString('hex')))
    .toString('base64'),
	});
});

router.get("/start", function(req, res, next) {
	if (!req.query.token) {
		res.redirect(process.env.HOST_SERVICE);
	} else if (process.env.HOST_SERVICE) {
		rp({
			method: "GET",
			uri: process.env.HOST_SERVICE+"/api/info",

			qs: {
				secret: process.env.PUZZLE_SECRET,
				token: req.query.token,
			},
			json: true
		}).then(function(data) {
			if (data.status == "success" && data.access) {
				req.session.token = data.data.token;
				req.session.id = data.data.id;
				res.redirect("/");
			} else {
				res.redirect(process.env.HOST_SERVICE);
			}
		}).catch(function(data) {
			res.send(data.error.message);
		});
	} else {
		req.session.token = "sample token";
		req.session.id = "12345";
		res.redirect("/");
	}
});

router.post("/", function(req, res, next) {
  var passcode = calculateHash(req.session.id).toString();

	if(req.body.code == passcode) {
		 if (process.env.HOST_SERVICE) {
	 		rp({
	 			method: "GET",
	 			uri: process.env.HOST_SERVICE+"/api/completed",
	 			qs: {
	 				secret: process.env.PUZZLE_SECRET,
	 				token: req.session.token,
	 			},
	 			json: true
	 		})
	 	}
		 res.json({
 			status: "success",
 			reason: "You found the correct passcode!",
			redirect: process.env.HOST_SERVICE,
 		});
	} else {
		res.json({
		 status: "invalid",
		 reason: "Wrong passcode"
	 });
	}
});

function calculateHash (id){
	var hash = crypto.createHash('md5').update(id).digest('base64');
	return Buffer.from(hash.substring(0,8));
}

module.exports = router;
