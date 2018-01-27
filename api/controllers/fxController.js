console.log(process.cwd());

exports.list_fxs = function(req,res) {
	//GET /fxs
	//TODO: Create Config

	var msg = 'Full Effect Array Requested\n time: ' + Date.now() + "\n";
	console.log(msg);
	var effect_info = req.app.locals.effects.info();
	res.send(effect_info.replace(/\n/g, "<br>"));
}

exports.enable_fx = function(req,res) {
	//POST /fxs
	//Request to enable client control of req.params.fxId
	//console.log(req);
	console.log('Request to enable fxId: ' + req.body.fxId + '\n' + Date.now() );
	res.send('Requested Enable for fxId: ' + req.body.fxId + '\n' + Date.now() );

}


exports.disable_fxs = function(req,res) {
	//DELETE /fxs
	//turn EVERYTHING off. Disable all fx.
	console.log('Master Shut Off Request');
	res.send('Master Shut Off Request Received' +'\n' + Date.now() );

}

exports.get_fx_details = function(req,res) {
	//GET /fx/:fxId
	//type and state informatiom for req.params.fxId
	console.log('Details request for fxId:'+  req.params.fxId);
	res.send('Details requst for fxId: ' + req.params.fxId);
}

exports.set_fx_state = function(req,res) {
	//POST /fx/:fxId
	//change state of req.params.fxId to req.params.fxState
	console.log('State change requested for fxId: ' + req.params.fxId);
	console.log('New State Requested: ' + req.params.fxState);
	effects.CommandEffect(req.params.fxId, req.params.fxState);


	res.send('State change request for fxId: ' + req.params.fxId);
}


exports.disable_fx = function(req,res){
	//DELETE /fxs/:fx
	//Turn off and disable client control of req.params.fxId
	console.log('Disable request for fxId: ' + req.params.fxId);
	res.send('Disable request for fxId: ' + req.params.fxId);
}
