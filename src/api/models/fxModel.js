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
		var fxs = []
		for(var i=0; i<12; i++) {
			fxs[i] = "init";
		}
		return fxs;
  }

	CommandEffect = function(id, state) {
		if(this.effect_array[id] != "Disabled") {
		    this.SetEffectState(id, state);
    } else {
      console.log("Cannot Command Disabled Effect ID: " + id);
      return false;
    }
	}

	SetEffectState = function(id, state) {
		//check for valid state
		if (!(state == 1 || state == 0 )) {
			throw "\ninvalid state:" + state + "\nfor id: " + id;
		}
    try {
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
      //TODO: check state and set Value to 0 before and set Disabled in the callback
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
