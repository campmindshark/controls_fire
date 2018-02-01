exports.system_info = function(req,res) {
	//GET /info
	console.log('\nSystem Information Request: ' + Date.now());
	var msg = req.app.locals.effects.info();
	res.send(msg);
}

exports.list_fxs = function(req,res) {
	//GET /fxs
	//TODO: Create Config
	console.log('Full Effect Array Requested\n time: ' + Date.now() + "\n");
	var msg = req.app.locals.effects.get_array_details();
	res.send(msg);
}

exports.enable_fx = function(req,res) {
	//POST /fxs
	//Request to enable client control of req.params.fxId
	//console.log(req);
	console.log('\nRequest to enable fxId: ' + req.body.fxId + '\n' + Date.now());
	//handle either gpio id or part.name
	var id = req.app.locals.effects.id_check(req.body.fxId);
	if (id != "bad id") {
		var msg = handle_api_call(req.app.locals.effects.enable_effect(id)
		, 'Enabled fxId: ' + req.body.fxId + '\n'
		, 'Request to Enable fxId ' + req.body.fxId + '\n');
		res.send(msg);
	} else {
		res.send('Bad Id');
	}
}

exports.disable_fxs = function(req,res) {
	//DELETE /fxs
	//turn EVERYTHING off. Disable all fx.
	console.log('Master Shut Off Request' + '\n' + Date.now());
	var msg = handle_api_call(req.app.locals.effects.master_shut_off(true)
	,"Master Shut Off Request Completed"
	,"Master Shut Off Request Did Not Complete")
	res.send(msg);
}

exports.get_fx_details = function(req,res) {
	//GET /fx/:fxId
	//type and state informatiom for req.params.fxId
	console.log('Details request for fxId:'+  req.params.fxId);
	var id = req.app.locals.effects.id_check(req.params.fxId);
	if (id != 'bad id') {
		var msg = req.app.locals.effects.get_effect_details(id);
		res.send(msg);
	} else {
		res.send('Bad Id');
	}
}

exports.set_fx_state = function(req,res) {
	//POST /fx/:fxId
	//change state of req.params.fxId to req.params.fxState
	console.log('\nState change requested for fxId: ' + req.params.fxId);
	console.log('\nNew State Requested: ' + req.body.fxState);
	var id = req.app.locals.effects.id_check(req.params.fxId);
	if (id != 'bad id') {
		var msg = handle_api_call(
			req.app.locals.effects.command_effect(id, req.body.fxState)
			, "\nEffect command completed."
			, "\nEffect command did not complete"
		);
		res.send(msg);
	} else {
		res.send('Bad Id');
	}
}

exports.disable_fx = function(req,res){
	//DELETE /fxs/:fx
	//Turn off and disable client control of req.params.fxId
	console.log('Disable request for fxId: ' + req.params.fxId);
	var id = req.app.locals.effects.id_check(req.params.fxId);
	if (id != 'bad id') {
		var msg = handle_api_call(
			req.app.locals.effects.disable_effect(id, false)
			,"\nEffect ID: " + req.params.fxId + " has been Disabled."
			,"\nEffect ID: " + req.params.fxId + " could not been Disabled."
		)
		res.send(msg);
	} else {
		res.send('Bad Id');
	}

}

const handle_api_call = function(method_call, success_msg, fail_msg,) {
	try {
		var msg;
		if (method_call) {
			msg = '\nSUCCESS: ' + Date.now() + '\n' + success_msg;
		} else {
			msg = '\nFAIL: ' + Date.now() + '\n' + fail_msg;
		}
	}
	catch(err) {
		msg = err;
	}
	return msg;
}
