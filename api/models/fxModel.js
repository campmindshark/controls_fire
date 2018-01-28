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
			fxs[i] = new gpio(i, this.ModeTest(), 0);
		}
		return fxs;
  }

	CommandEffect = function(id, state) {
		//TODO: check if effect is enabled
		this.SetEffectState(id, state);
	}

	SetEffectState = function(id, state) {
		//check for valid state
		if (!(state == 1 || state == 0 )) {
			return "invalid state";
		}
		this.effect_array[id].Value = state;
		return this.effect_array[id];
	}

	ModeTest = function() {
		//only mocking gpio work for now
		return "mock";
	}

}
