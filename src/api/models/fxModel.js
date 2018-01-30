import gpio from "./gpioModel";

export default class Effects {
  constructor(id, config) {
    this.id = id;
    this.config = config;
		this.effect_array = this.BuildArray();
  }

  BuildArray = function BuildArray() {
		//TODO: create based on passed config
		//just a dummy array for now
		var fxs = [];
		for(var i=0; i<12; i++) {
      //do not initialize gpio until an enable has been received from a client.
			fxs[i] = "init";
		}
		return fxs;
  }

	CommandEffect = function(id, state) {
		if(this.effect_array[id] != "Disabled") {
		    if (this.SetEffectState(id, state)) {
          console.log("New effect state set");
          return true;
        } else {
          console.log("Failed to set new effect state");
          return false;
        }
    } else {
      console.log("Cannot Command Disabled Effect ID: " + id);
      return false;
    }
	}

	SetEffectState = function(id, state) {
    try {
        //check for valid state
        if (!(state == 1 || state == 0 )) {
          throw "\ninvalid state:" + state + "\nfor id: " + id;
        }
		    this.effect_array[id].Value = state;
		      return true;
    }
    catch(err) {
      console.log(err);
      return false;
    }
	}

  Enable_Effect = function(id) {
    try {
      this.effect_array[id] = new gpio(id, this.ModeTest(), 0);
      return true;
    }
    catch(err) {
      return false;
    }
  }

  Disable_Effect = function(id) {
    try {
      //TODO: check state and set .Value to 0 before and set Disabled in the callback
      this.effect_array[id] = "Disabled";
      return true;
    }
    catch(err) {
      return false;
    }
  }

	ModeTest = function() {
    //TODO: add Beaglebone black mode
		//only mocking gpio work for now
		return "mock";
	}

}
