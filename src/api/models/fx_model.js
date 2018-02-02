
import gpio from "./gpio_model";

export default class Effects {
  constructor(json_config) {
    var config = JSON.parse(json_config);

    this.name = config.name;
    this.version = config.version;
    this.effect_array = this.build_effect_array(config.parts);
    this.internal = this.build_internal_array(config.internal_parts);
  }

  //#region Property Builders
  build_effect_array = function(parts) {

    if (parts != null && parts.length > 0) {
      if (parts.length > gpio.gpio_pins.length) {
        throw "TOO MANY PARTS. Configure fewer parts.";
      }
      var fxs = [];
      for (var i = 0; i< parts.length; i++) {
        //TODO: do something with the different input types
        //TODO: load initial values from config
        fxs[i] =
        {
          "part" : parts[i],
          "gpio" : "init"
        };
      }
      return fxs;
    } else {
      throw "ERROR: No Parts Configured.\nYou must configure parts to control fire.";
    }
  }

  build_internal_array = function(internal_parts) {
    if(internal_parts != null && internal_parts.length > 0) {
      if(internal_parts.find((element) => { return element.name === "master_power"})) {
        return internal_parts;
      } else {
        throw "ERROR: Internal Parts Array does not have a master_power configured.\nConfigure master_power in internal_parts";
      }
    } else {
      throw "ERROR: No Internal Parts Configured.\nYou must configure a master_power part in internal_parts at a minimum.";
    }
  }

  build_demo_array = function() {
    //just a dummy array of 12 effects
    var fxs = [];
    for(var i=0; i<12; i++) {
      fxs[i] = "init";
    }
    return fxs;
  }
  //#endregion
  //#region GET
  info = function() {
    return JSON.stringify(this);
  }

  get_array_details = function() {
    var out_data = [];
    for(var i=0;i<this.effect_array.length; i++) {
      out_data[i] = this.get_effect_details(i);
    }
    return JSON.stringify(out_data);
  }

  get_effect_details = function(id) {
    console.log(this.effect_array[id].gpio);
    return {
      "id": this.effect_array[id].gpio.id,
      "name": this.effect_array[id].part.name,
      "enabled": this.effect_array[id].gpio != 'disabled' && this.effect_array[id].gpio != 'init' ? 'enabled' : 'disabled',
      "type": this.effect_array[id].part.type,
      "gpio_mode": this.mode_test(),
      "Value": this.effect_array[id].gpio.Value
    };
  }
  //#endregion
  //#region POST
  enable_effect = function(id) {
    try {
      this.effect_array[id].gpio = new gpio(id, this.mode_test(), 0);
      console.log (this);
      return true;
    }
    catch(err) {
      return false;
    }
  }

  command_effect = function(id, state) {
    if(this.effect_array[id].gpio != "disabled") {
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
  //#endregion
  //#region DELETE
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

  disable_effect = function(id, graceful) {
    try {
      if (graceful) {
        this.effect_array[id].gpio.Value = 0;
      }
      this.effect_array[id].gpio = "disabled";
      return true;
    }
    catch(err) {
      return false;
    }
  }
  //#endregion
  //#region Data Tests
  id_test = function(test_id) {
    //TODO: handle the ids better. a db would probably help.
    if (typeof !isNaN(parseInt(test_id)) && isFinite(test_id) && test_id < this.effect_array.length) {
      return test_id;
    } else {
      return "bad id";
    }
  }

  mode_test = function() {
    //TODO: add Beaglebone black mode
    //only mocking gpio work for now
    return "mock";
  }
  //#endregion
  //#region GPIO

  set_effect_state = function(id, state) {
    try {
      //TODO: do better about states and validating them.
      if (!(state == 1 || state == 0 )) {
        throw "\ninvalid state:" + state + "\nfor id: " + id;
      }
      this.effect_array[id].gpio.Value = state;
      return true;
    }
    catch(err) {
      console.log(err);
      return false;
    }
  }
  //#endregion
}
