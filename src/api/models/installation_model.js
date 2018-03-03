import os from 'os';
import BbbGpio from "./bbb_gpio_model";

export default class Installation {
  constructor(installation_config, callback) {
    this.name = installation_config.name;
    this.version = installation_config.version;
    this.id_test = this.id_test.bind(this);
    this.parts = [];

    Installation.build_part_array(installation_config.parts, false,
      (err, parts) => {
        if (err) {
          callback(err);
        }
        this.parts = parts;
        callback(null, parts);
      });
  }

  static build_part_array(parts, enable_on_create, callback) {
    if (parts != null && parts.length > 0) {
      if (parts.length > BbbGpio.pins.length) {
        callback("TOO MANY PARTS. Configure fewer parts.");
      }
      add_next_part_to_array([], parts, callback);
    } else {
      callback('ERROR: No Parts Configured.\nYou must configure parts to control fire.');
    }

    function add_next_part_to_array(fx_array, parts, callback) {
      var part = parts.shift();
      var find_index_callback = (element) => {
        return element == part.gpio_pin;
      };
      var id = BbbGpio.pins.findIndex(find_index_callback);
      if (id != -1) {
        //add/set gpio property
        part.gpio = enable_on_create == true ?
          new BbbGpio(BbbGpio.pins[id],
            Installation.mode_test(),
            (part.inverted_output_device ? 1 : 0), (err) => {
              if (err) {
                callback(err);
              }
              push_part_and_continue();
            }) :
          "Disabled";
          push_part_and_continue();
      } else {
        callback("ERROR: Bad GPIO config : " + JSON.stringify(part));
      }

      function push_part_and_continue() {
        fx_array.push(part);
        if (parts.length > 0) {
          add_next_part_to_array(fx_array, parts, callback);
        } else {
          console.log('all parts built');
          callback(null, fx_array);
        }
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
      "gpio_mode": Installation.mode_test(),
      "value": part.gpio.get_value((err) => {
        if (err) {
          throw err;
        }
      })
    };
  }
  //#endregion
  //#region POST
  enable_effect(id) {
    try {
      var part = this.parts[id];
      part.gpio = new BbbGpio(part.gpio_pin, Installation.mode_test(), 0);
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
        console.error('Key Not Found. \nUnable to reconfigure key: ' + key + '\n');
      }
    } else {
      console.error('Bad Id: ' + id + '\nUnable to reconfigure.');
    }
    return false;
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
        this.parts[id].gpio.set_value(0, (err) => {
          if (err) {
            return false;
          }
          this.parts[id].gpio = "disabled";
          return true;
        });
      }
    } catch (err) {
      return false;
    }
  }
  //#endregion
  //#region Data Tests
  id_test(test_id) {
    if (typeof !isNaN(parseInt(test_id)) && isFinite(test_id) && test_id < this.parts.length) {
      return test_id;
    } else {
      return "bad id";
    }
  }
  //#endregion

}
