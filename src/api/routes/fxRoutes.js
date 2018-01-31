'use strict';

module.exports = function(app) {
	var fxs = require('../controllers/fxController');

	//Direct Effect Control Routes
	app.route('/fxs')
		// .get(fxs.list_fxs)
		.get(fxs.list_fxs)
		.post(fxs.enable_fx)
		.delete(fxs.disable_fxs);

	app.route('/fxs/:fxId')
		.get(fxs.get_fx_details)
		.post(fxs.set_fx_state)
		.delete(fxs.disable_fx);

	app.route('/info')
		.get(fxs.system_info);
};
