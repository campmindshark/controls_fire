exports.system_info = (req, res) => {
  //GET /system/info
  console.log("[System Controller] Full System Request at: " + Date.now());
  res.send(req.app.locals.system);
};
exports.get_system_value = (req, res) => {
  console.log("[System Controller] Value Request at: " + Date.now());
  const values = req.app.locals.system.values;

  const value = (req.params.key in values)
  ? req.app.locals.system.values[req.params.key]
  : "[System Controller] Error: Key Not Found";

  res.send(value);
};
