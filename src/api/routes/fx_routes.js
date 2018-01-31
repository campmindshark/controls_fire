'use strict';

module.exports = function(app) {
	var controller = require('../controllers/fx_controller');

	//Direct Effect Control Routes
	app.route('/fxs')
		// .get(fxs.list_fxs)
		.get(controller.list_fxs)
		.post(controller.enable_fx)
		.delete(controller.disable_fxs);

	app.route('/fxs/:fxId')
		.get(controller.get_fx_details)
		.post(controller.set_fx_state)
		.delete(controller.disable_fx);

	app.route('/info')
		.get(controller.system_info);
}
