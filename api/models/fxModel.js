import gpio from "./gpioModel";

export default class Effects {
  constructor(id, config) {
    this.id = id;
    this.config = config;
		this.effect_array = this.BuildArray();
  }

  BuildArray = function BuildArray() {
		//TODO: create based on passed config
		var fxs = []
		for(var i=0; i<12; i++) {
			fxs[i] = new gpio(i, 0);
		}
		return fxs;
  }

	CommandEffect = function CommandEffect(id, state) {
		//TODO: ensure id is in effect_array
		//TODO: check if effect is enabled
		SetEffectState(id, state);
	}

	SetEffectState = function(id, new_state) {
		//check for valid state
		if (!(newState == 1 || newState == 0 )) {

			return "invalid state";
		}

		this.effect_array[id].Value = new_state;
		return this.effect_array[id];
	}

}
