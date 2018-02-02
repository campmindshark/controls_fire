'use strict';

module.exports = function(app) {
	var fx_controller = require('../controllers/fx_controller');
	var sys_controller = require('../controllers/sys_controller');

	//Direct Effect Control Routes
	app.route('/fxs')
		// .get(fxs.list_fxs)
		.get(fx_controller.list_fxs)
		.post(fx_controller.enable_fx)
		.delete(fx_controller.disable_fxs);

	app.route('/fxs/:fxId')
		.get(fx_controller.get_fx_details)
		.post(fx_controller.set_fx_state)
		.delete(fx_controller.disable_fx);

	app.route('/system/info')
		.get(sys_controller.system_info);

	app.route('/system/pins')
		.get(sys_controller.pins);

}
