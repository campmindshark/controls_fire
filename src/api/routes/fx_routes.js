module.exports = function(app) {
    var fx_controller = require('../controllers/fx_controller');
    var sys_controller = require('../controllers/sys_controller');

    //Effect Array
    app.route('/fxs')
        .get(fx_controller.list_fxs)
        .post(fx_controller.enable_fx)
        .delete(fx_controller.disable_fxs);

    //Individual Effect
    app.route('/fxs/:fxId')
        .get(fx_controller.get_fx_details)
        .patch(fx_controller.update_config)
        .delete(fx_controller.disable_fx);

    //            .( * .
    //       .*  .  ) .
    //      . . POOF .* .
    //       '* . (  .) '
    //        ` ( . *
    app.route('/fxs/:fxId/fire')
        .post(fx_controller.open)
        .delete(fx_controller.close);

    //All data that's any data
    app.route('/system/')
        .get(sys_controller.system_info);


    app.route('/system/:key')
        .get(sys_controller.get_system_value);
};
