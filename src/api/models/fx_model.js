import os from 'os';
import BbbGpio from "./bbb_gpio_model";

export default class Effects {
  constructor(installation_config, system_config, callback) {
    this.name = installation_config.name;
    this.version = installation_config.version;
    this.id_test = this.id_test.bind(this);
    this.parts = [];

    //TODO: don't enable on create for effects
    Effects.build_part_array(installation_config.parts, true, callback,
      (err, parts, final_callback) => {
        if (err) {
          callback(err);
        }
        this.parts = parts;
        callback(null);
      });
  }

  static build_part_array(parts, enable_on_create, final_callback, callback) {
    if (parts != null && parts.length > 0) {
      if (parts.length > BbbGpio.pins.length) {
        final_callback("TOO MANY PARTS. Configure fewer parts.");
      }
      add_next_part_to_array([], parts, final_callback, callback);
    } else {
      final_callback('ERROR: No Parts Configured.\nYou must configure parts to control fire.');
    }

    function add_next_part_to_array(fx_array, parts, final_callback, callback) {
      var part = parts.shift();
      var findIndexCallback = function(element) {
        return element == part.gpio_pin;
      };
      var id = BbbGpio.pins.findIndex(findIndexCallback);
      if (id != -1) {
        //add/set gpio property
        part.gpio = enable_on_create == true ?
                    new BbbGpio(BbbGpio.pins[id], Effects.mode_test(), 0) :
                    "Disabled";
        fx_array.push(part);
      } else {
        final_callback("ERROR: Bad GPIO config : " + JSON.stringify(part));
      }
      if (parts.length > 0) {
        add_next_part_to_array(fx_array, parts, final_callback, callback);
      } else {
        console.log('all parts built');
        callback(null, fx_array, final_callback);
      }
    }
  }
  static mode_test() {
    // get live for bones
    if (os.hostname().indexOf('bone') > 0) {
      return "live";
    }
    //mock all others.
    return "mock";
  }
  //#region GET
  info() {
    return JSON.stringify(this);
  }

  get_array_details() {
    var out_data = [];
    for (var i = 0; i < this.parts.length; i++) {
      out_data[i] = this.get_effect_details(i);
    }
    return JSON.stringify(out_data);
  }

  get_effect_details(id) {
    console.log(this.parts[id].gpio);
    var part = this.parts[id];
    return {
      "id": part.gpio.id,
      "name": part.name,
      "enabled": part.gpio != 'Disabled' ? 'enabled' : 'disabled',
      "type": part.type,
      "gpio_mode": Effects.mode_test(),
      "Value": part.gpio.Value
    };
  }
  //#endregion
  //#region POST
  enable_effect(id) {
    try {
      var part = this.parts[id];
      part.gpio = new BbbGpio(part.gpio_pin, Effects.mode_test(), 0);
      console.log(this);
      return true;
    } catch (err) {
      return false;
    }
  }

  reconfigure(part_id, key, value) {
    var id = this.id_test(part_id);
    if (id != 'bad id') {
      if (key in this.parts[id]) {
        switch (key) {
          case 'gpio':
            var part_to_disable = this.parts.find((element) => {
              return (BbbGpio.pins[element.gpio.id] == value && element.id != id);
            });
            if (part_to_disable != undefined) {
              this.disable_effect(part_to_disable.id, true);
            }
            this.parts[id].part.gpio = value;
            this.parts[id].gpio = "init";
            return true;
          default:
            this.parts[id].part[key] = value;
            return true;
        }
      } else {
        //key not found
        console.log('Key Not Found. \nUnable to reconfigure key: ' + key + '\n');
        return false;
      }
    } else {
      //Bad ID error
      console.log('Bad Id: ' + id + '\nUnable to reconfigure.');
    }
  }
  //#endregion
  //#region DELETE
  master_shut_off(graceful) {
    try {
      this.parts.forEach(
        (element) => {
          this.disable_effect(element.id, graceful);
        }
      );
      return true;
    } catch (err) {
      return false;
    }
  }

  disable_effect(id, graceful) {
    try {
      if (graceful) {
        this.parts[id].gpio.Value = 0;
      }
      this.parts[id].gpio = "disabled";
      return true;
    } catch (err) {
      return false;
    }
  }
  //#endregion
  //#region Data Tests
  id_test(test_id) {
    //TODO: handle the ids better. a db would probably help.
    if (typeof !isNaN(parseInt(test_id)) && isFinite(test_id) && test_id < this.parts.length) {
      return test_id;
    } else {
      return "bad id";
    }
  }
  //#endregion
  //#region The Bench.

  command_effect(id, state) {
    if (this.parts[id].gpio != "disabled") {
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

  set_effect_state(id, state) {
    try {
      //TODO: do better about states and validating them.
      if (!(state == 1 || state == 0)) {
        throw "\ninvalid state:" + state + "\nfor id: " + id;
      }
      this.parts[id].gpio.Value = state;
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  //#endregion

}
