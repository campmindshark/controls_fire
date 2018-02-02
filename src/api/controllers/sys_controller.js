exports.system_info = function(req,res) {
	//GET /info
	console.log('\nSystem Information Request: ' + Date.now());
	var msg = req.app.locals.effects.info();
	res.send(msg);
}
