import gpio from '../models/gpio_model'

exports.system_info = function(req,res) {
	//GET /info
	console.log('\nSystem Information Request: ' + Date.now());
	var msg = req.app.locals.effects.info();
	res.send(msg);
}

exports.pins = function(req,res) {
	//get /system/pins
	res.send({
		"gpio":gpio.gpio_pins,
		"power_relay": gpio.power_relay_pin
	});
}
