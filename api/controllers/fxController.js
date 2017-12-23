exports.list_fxs = function(req,res) {
	//GET /fxs
	console.log('Full Effect Array Requested');
}

exports.enable_fx = function(req,res) { 
	//POST /fxs
	//Request to enable client control of req.params.fxId 
	console.log('Request to enable fx: ' + req.params.fxId);
}


exports.disable_fxs = function(req,res) {
	//DELETE /fxs
	//turn EVERYTHING off. Disable all fx.i
	console.log('Master shut off request');
}

exports.get_fx_details = function(req,res) {
	//GET /fx/:fxId
	//type and state informatiom for req.params.fxId
	console.log('Details request for fxId:'+  req.params.fxId);
}

exports.set_fx_state = function(req,res) {
	//POST /fx/:fxId
	//change state of req.params.fxId to req.params.fxState
	console.log('State change requested for fx: ' + req.params.fxId);
}


exports.disable_fx = function(req,res){
	//DELETE /fxs/:fx
	//Turn off and disable client control of req.params.fxId
	console.log('Disable request for fx: ' + req.params.fxId);
}

