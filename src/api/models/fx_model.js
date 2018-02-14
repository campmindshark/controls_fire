import BbbGpio from "./bbb_gpio_model";
import os from 'os';
import PartData from './data/part_data';

export default class Effects {
  constructor(installation_config, system_config) {
    this.name = installation_config.name;
    this.version = installation_config.version;
    this.effect_array = Effects.build_part_array(installation_config.parts, false);
  }

  static build_part_array(parts, enable_on_create) {
    console.log(parts.length);
    if (parts != null && parts.length > 0) {
      if (parts.length > BbbGpio.pins.length) {
        throw "TOO MANY PARTS. Configure fewer parts.";
      }
      var fxs = [];
      var findIndexCallback = function(element) {
        return element == parts[i].gpio;
      };
      for (var i = 0; i < parts.length; i++) {
        //TODO: do something with the different input types
        var id = BbbGpio.pins.findIndex(findIndexCallback);
        if (id != -1)
        {
          fxs[i] = {
          "part": parts[i],
          "gpio": enable_on_create ? new gpio(id, this.mode_test(), 0) : "Disabled"
        };
      } else {
        throw "ERROR: Bad GPIO config : " + JSON.stringify(system_parts[i]);
      }
      }
      return fxs;
    } else {
      throw 'ERROR: No Parts Configured.\nYou must configure parts to control fire.';
    }
  }
  //#region GET
  info() {
    return JSON.stringify(this);
  }

  get_array_details() {
    var out_data = [];
    for (var i = 0; i < this.effect_array.length; i++) {
      out_data[i] = this.get_effect_details(i);
    }
    return JSON.stringify(out_data);
  }

  get_effect_details(id) {
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
  enable_effect(id) {
    try {
      this.effect_array[id].gpio = new BbbGpio(id, this.mode_test(), 0);
      console.log(this);
      return true;
    } catch (err) {
      return false;
    }
  }

  reconfigure(part_id, key, value) {
    var id = this.id_test(part_id);
    if (id != 'bad id') {
      if (key in this.effect_array[id]) {
        switch (key) {
          case 'gpio':
            var part_to_disable = this.effect_array.find((element) => {
              return (BbbGpio.pins[element.gpio.id] == value && element.id != id);
            });
            if (part_to_disable != undefined) {
              this.disable_effect(part_to_disable.id, true);
            }
            this.effect_array[id].part.gpio = value;
            this.effect_array[id].gpio = "init";
            return true;
          default:
            this.effect_array[id].part[key] = value;
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
      this.effect_array.forEach(
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
        this.effect_array[id].gpio.Value = 0;
      }
      this.effect_array[id].gpio = "disabled";
      return true;
    } catch (err) {
      return false;
    }
  }
  //#endregion
  //#region Data Tests
  id_test(test_id) {
    //TODO: handle the ids better. a db would probably help.
    if (typeof !isNaN(parseInt(test_id)) && isFinite(test_id) && test_id < this.effect_array.length) {
      return test_id;
    } else {
      return "bad id";
    }
  }

  mode_test() {
    // get live for bones
    if (os.hostname().indexOf('bone') > 0) {
      return "live";
    }
    //mock all others.
    return "mock";
  }
  //#endregion
  //#region The Bench.

  command_effect(id, state) {
    if (this.effect_array[id].gpio != "disabled") {
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
      this.effect_array[id].gpio.Value = state;
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  //#endregion
}
