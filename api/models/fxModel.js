import gpio from "gpioModel";

var  Effects = class EffectsModel {
  constructor(id, config) {
    this.id = id;
    this.config = config;
		this.effect_array = [];
		CreateArray();
  }

  CreateArray = function() {
		//TODO: load from config
		for(i=0; i<12; i++) {
			this.effect_array[i] = new gpio(i, 0);
		}
  }
}

var Effect = class Effect {
	constructor(id, gpio_pin) {
		this.id = id;
		this.gpio_pin = gpio_pin;
	}

	CreateEffect = function () {

	};

	SetEffectState = function(new_state) {
		if (!(newState == 1 || newState == 0 )) {
			return "invalid state";
		}
		this.gpio_pin.Value = new_state;
	}
}
