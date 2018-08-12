//#region /fxs
exports.list_fxs = function(req, res) {
  //GET /fxs
  console.log(
    "[Effect Controller]",
    " Full Array Info Requested: ",
    Date.now()
  );
  const msg = req.app.locals.system.installation.get_array_details();
  res.send(msg);
};

exports.enable_fx = async function(req, res) {
  //POST /fxs
  //Request to enable client control of req.body.fxId
  try {
    console.log(
      "[Effect Controller]",
      " Enable Request fxId: ",
      req.body.fxId,
      Date.now()
    );
    const enabled_part = await req.app.locals.system.installation.enable_effect(
      req.body.fxId
    );
    res.send(enabled_part);
  } catch (err) {
    res.send(
      "[Effect Controller]: Enable request did not succeed. fxId: " +
        req.body.fxId
    );
  }
};

exports.disable_fxs = async function(req, res) {
  //DELETE /fxs
  //turn EVERYTHING off. Disable all fx.
  try {
    console.log("[Effect Controller]", "Master Shut Off Request: ", Date.now());
    const msg = await req.app.locals.system.installation.master_shut_off(true);
    res.send(msg);
  } catch (err) {
    res.send(
      "[Effect Controller]: Disable request did not succeed. fxId: " +
        req.body.fxId
    );
  }
};
//#endregion
//#region /fxs/:fxId
exports.get_fx_details = function(req, res) {
  //GET /fx/:fxId
  //type and state informatiom for req.params.fxId
  console.log(
    "[Effect Controller]",
    "Details request for fxId: ",
    req.params.fxId
  );
  const msg = req.app.locals.system.installation.get_effect_details(
    req.params.fxId
  );
  res.send(msg);
};

exports.update_config = function(req, res) {
  //PATCH /fx/:fxId
  console.log("[Effect Controller]");
  console.log("Config update requested for fxId: " + req.params.fxId);
  console.log("Config key: " + req.body.key);
  console.log("Requested value: " + req.body.value);

  const id = req.params.fxId;
  if (id != null) {
    const msg = req.app.locals.system.installation.reconfigure(
      id,
      req.body.key,
      req.body.value
    );
    res.send(msg);
  } else {
    res.send("Bad Id");
  }
};

exports.disable_fx = async function(req, res) {
  //DELETE /fxs/:fxId
  //Turn off and disable client control of req.params.fxId
  console.log(
    "[Effect Controller]",
    "Disable request for fxId: ",
    req.params.fxId
  );
  if (req.params.fxId != null) {
    const msg = await req.app.locals.system.installation.disable_effect(
      req.params.fxId,
      false
    );
    res.send(msg);
  } else {
    res.send("[Effect Controller]: Bad Id.");
  }
};
//#endregion
//#region /fxs/:fxId/fire
exports.fire = function(req, res) {
  //POST /fxs/:fxId/fire
  const part = req.app.locals.system.installation.parts[req.params.fxId];
  let new_value;
  if (req.body.open == 1) {
    new_value = part.inverted_output_device ? 0 : 1;
  } else {
    new_value = part.inverted_output_device ? 1 : 0;
  }
  part.gpio.set_value(new_value);
  res.send(JSON.stringify(part));
};
exports.close = function(req, res) {
  //DELETE /fxs/:fxId/fire
  const part = req.app.locals.system.installation.parts[req.params.fxId];
  const new_value = part.inverted_output_device ? 1 : 0;
  part.gpio.set_value(new_value);
  res.send(JSON.stringify(part));
};
//#endregion
