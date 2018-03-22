exports.system_info = function(req, res) {
  //GET /system/info
  console.log("[System Controller] Full System Request at: " + Date.now());
  res.send(req.app.locals.system);
};
exports.get_system_value = function(req, res) {
  console.log("[System Controller] Value Request at: " + Date.now());
  var key = req.params.key;
  var values = req.app.locals.system.values;
  var value = "[System Controller] Error: Key Not Found";
  if (key in values) {
    value = req.app.locals.system.values[req.params.key];
  }
  res.send(value);
};
