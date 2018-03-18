import fx_controller from '../controllers/fx_controller';
import sys_controller from '../controllers/sys_controller';

exports.routes = function(app) {
    //Effect Array
    app.route('/fxs')
        .get(fx_controller.list_fxs)
        .post(fx_controller.enable_fx)
        .delete(fx_controller.disable_fxs);

    //Individual Effect
    app.route('/fxs/:fxId')
        .get(fx_controller.get_fx_details)
        .patch(fx_controller.update_config)
        .delete(fx_controller.disable_fx)
        //            .( * .
        //       .*  .  ) .
        //      . . POOF .* .
        //       '* . (  .) '
        //        ` ( . *
        .post(fx_controller.fire);


    //All data that's any data
    app.route('/system/')
        .get(sys_controller.system_info);

    app.route('/system/:key')
        .get(sys_controller.get_system_value);

};
