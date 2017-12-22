exports.list_fxs = function(req,res) {
	//GET /fxs
}

exports.enable_fx(req,res) { 
	//POST /fxs
	//Request to enable client control of req.params.fxId 
}


exports.disable_fxs(req,res) {
	//DELETE /fxs
	//turn EVERYTHING off. Disable all fx.
}

exports.get_fx_details(req,res) {
	//GET /fx/:fxId
	//type and state informatiom for req.params.fxId
}

exports.set_fx_state(req,res) {
	//POST /fx/:fxId
	//change state of req.params.fxId to req.params.fxState
}


exports.disable_fx(req,res){
	//DELETE /fxs/:fx
	//Turn off and disable client control of req.params.fxId
}

