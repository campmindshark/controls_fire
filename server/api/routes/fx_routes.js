import path from "path";
import fx_controller from "../controllers/fx_controller";
import sys_controller from "../controllers/sys_controller";

exports.routes = (app) => {
  app
    .route("/")
    .get((req, res) => {
      const hot_and_gui_path = path.resolve("./hot_and_gui/static/index.html");
      res.sendFile(hot_and_gui_path);
    });
  app
    .route("/fxs")
    .get(fx_controller.list_fxs)
    .post(fx_controller.enable_fx)
    .delete(fx_controller.disable_fxs);

  app
    .route("/fxs/:fxId")
    .get(fx_controller.get_fx_details)
    .patch(fx_controller.update_config)
    .delete(fx_controller.disable_fx)
    //            .( * .
    //       .*  .  ) .
    //      . . POOF .* .
    //       '* . (  .) '
    //        ` ( . *
    .post(fx_controller.fire);

  app.route("/system/").get(sys_controller.system_info);

  app.route("/system/:key").get(sys_controller.get_system_value);
};
