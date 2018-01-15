var gpio = [30,31,48,5,3,49,117,115,111,110,20
				,60,50,51,4,2,15,14,113,112,7
				,38,34,66,69,45,23,47,27,22,62,36,32,86,87,10,9,8,78,76,74,72,70
				,39,35,67,68,44,26,46,65,63,37,33,61,88,89,11,81,80,79,77,75,73,71];

exports.list_fxs = function(req,res) {
	//GET /fxs
	console.log('Full Effect Array Requested' + '\n' + Date.now() );
	res.send('Full Effect Array Request Received\n');
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

	var newState = req.params.fxState;
	var base_path = "/sys/class/gpio";
	
	if (!(newState == 1 || newState == 0 )) {
		return "invalid state";
	}
	var fs = require('fs');
	fs.writeFile("/sys/class/gpio/gpio" + gpio[req.params.fxId], fxState, function(err) {
    	if(err) {
    		console.log(err);
        	return err;
    	}
    	console.log("New State Written: " + newState);
	}); 


	res.send('State change request for fxId: ' + req.params.fxId);	
}


exports.disable_fx = function(req,res){
	//DELETE /fxs/:fx
	//Turn off and disable client control of req.params.fxId
	console.log('Disable request for fxId: ' + req.params.fxId);
	res.send('Disable request for fxId: ' + req.params.fxId);
}

