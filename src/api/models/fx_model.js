import ConfigManager from "./config_manager"
import gpio from "./gpio_model";

export default class Effects {
  constructor(json_config) {
    this.config = new ConfigManager(json_config);
    this.id = this.config.value('id');
    this.version = this.config.value('version');

  	//TODO: create based on passed config
		this.effect_array = ConfigManager.build_demo_array();
  }

  info = function() {
    //TODO: pretty print this
    return JSON.stringify(this);
  }

  get_array_details = function() {
    return JSON.stringify(this.effect_array);
  }

	command_effect = function(id, state) {
		if(this.effect_array[id] != "Disabled") {
		    if (this.set_effect_state(id, state)) {
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

	set_effect_state = function(id, state) {
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

  enable_effect = function(id) {
    try {
      this.effect_array[id] = new gpio(id, this.mode_test(), 0);
      return true;
    }
    catch(err) {
      return false;
    }
  }

  disable_effect = function(id, graceful) {
    try {
      if (graceful) {
        this.effect_array[id].Value = 0;
      }
      this.effect_array[id] = "Disabled";
      return true;
    }
    catch(err) {
      return false;
    }
  }

  master_shut_off = function(graceful) {
    try {
      this.effect_array.forEach(
        (element) =>
        {
          this.disable_effect(element.id, graceful);
        }
      );
      return true;
    }
    catch(err) {
      return false;
    }
  }

	mode_test = function() {
    //TODO: add Beaglebone black mode
		//only mocking gpio work for now
		return "mock";
	}

}
