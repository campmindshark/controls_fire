//#region /fxs
exports.list_fxs = function(req, res) {
    //GET /fxs
    console.log('Full Effect Array Requested\n time: ' + Date.now() + "\n");
    var msg = req.app.locals.effects.get_array_details();
    res.send(msg);
}

exports.enable_fx = function(req, res) {
    //POST /fxs
    //Request to enable client control of req.params.fxId
    //console.log(req);
    console.log('\nRequest to enable fxId: ' + req.body.fxId + '\n' + Date.now());
    var id = req.app.locals.effects.id_test(req.body.fxId);
    if (id != "bad id") {
        var msg = handle_api_call(req.app.locals.effects.enable_effect(id), 'Enabled fxId: ' + req.body.fxId + '\n', 'Request to Enable fxId ' + req.body.fxId + '\n');
        res.send(msg);
    } else {
        res.send('Bad Id');
    }
}

exports.disable_fxs = function(req, res) {
    //DELETE /fxs
    //turn EVERYTHING off. Disable all fx.
    console.log('Master Shut Off Request' + '\n' + Date.now());
    var msg = handle_api_call(req.app.locals.effects.master_shut_off(true), "Master Shut Off Request Completed", "Master Shut Off Request Did Not Complete")
    res.send(msg);
}
//#endregion
//#region /fxs/:fxId
exports.get_fx_details = function(req, res) {
    //GET /fx/:fxId
    //type and state informatiom for req.params.fxId
    console.log('Details request for fxId:' + req.params.fxId);
    var id = req.app.locals.effects.id_test(req.params.fxId);
    if (id != 'bad id') {
        var msg = req.app.locals.effects.get_effect_details(id);
        res.send(msg);
    } else {
        res.send('Bad Id');
    }
}

exports.update_config = function(req, res) {
    //PATCH /fx/:fxId
    console.log('\nConfig update requested for fxId: ' + req.params.fxId + '\n');
    console.log('\nConfig key: ' + req.body.key + '\n');
    console.log('\nRequested value: ' + req.body.value + '\n');

    var id = req.app.locals.effects.id_test(req.params.fxId);
    if (id != 'bad id') {
        var msg = handle_api_call(
            req.app.locals.effects.reconfigure(id, req.body.key, req.body.value), "\nEffect command completed.", "\nEffect command did not complete"
        );
        res.send(msg);
    } else {
        res.send('Bad Id');
    }
}

exports.disable_fx = function(req, res) {
    //DELETE /fxs/:fxId
    //Turn off and disable client control of req.params.fxId
    console.log('Disable request for fxId: ' + req.params.fxId);
    var id = req.app.locals.effects.id_test(req.params.fxId);
    if (id != 'bad id') {
        var msg = handle_api_call(
            req.app.locals.effects.disable_effect(id, false), "\nEffect ID: " + req.params.fxId + " has been Disabled.", "\nEffect ID: " + req.params.fxId + " could not been Disabled."
        )
        res.send(msg);
    } else {
        res.send('Bad Id');
    }

}
//#endregion
//#region /fxs/:fxId/fire
exports.open = function(req, res) {
    //POST /fxs/:fxId/fire
    req.app.locals.effects.effect_array[req.params.fxId].gpio.Value = 1;
}
exports.close = function(req, res) {
    //DELETE /fxs/:fxId/fire
    req.app.locals.effects.effect_array[req.params.fxId].gpio.Value = 0;

}
//#endregion

const handle_api_call = function(method_call, success_msg, fail_msg, ) {
    try {
        var msg;
        if (method_call) {
            msg = '\nSUCCESS: ' + Date.now() + '\n' + success_msg;
        } else {
            msg = '\nFAIL: ' + Date.now() + '\n' + fail_msg;
        }
    } catch (err) {
        msg = err;
    }
    return msg;
}