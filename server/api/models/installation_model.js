import os from "os";
import BbbGpio from "./bbb_gpio_model";

export default class Installation {
  constructor(installation_config) {
    this.name = installation_config.name;
    this.version = installation_config.version;
    this.parts = installation_config.parts;

    this.get_array_details = this.get_array_details.bind(this);
    this.master_shut_off = this.master_shut_off.bind(this);
    this.get_effect_details = this.get_effect_details.bind(this);
    this.enable_effect = this.enable_effect.bind(this);
  }
  async initialize() {
    console.log("[Installation]: Init Start");
    this.parts = await Installation.build_part_array(this.parts);
    console.log("[Installation]: Init Parts Built");
  }
  //#region Static Methods
  static async build_part_array(parts, enable_on_create = false) {
    if (parts != null && parts.length > 0) {
      if (parts.length > BbbGpio.pins.length) {
        throw new Error("TOO MANY PARTS. Configure fewer parts.");
      }
      for (let i = 0; i < parts.length; i++) {
        parts[i] = await build_part(parts[i], enable_on_create);
      }
      console.log(parts);
      return parts;
    } else {
      throw new Error(
        "ERROR: No Parts Configured.\nYou must configure parts to control fire."
      );
    }

    async function build_part(part_config, enable_on_create) {
      const part = part_config,
      id = BbbGpio.pins.findIndex(element => {
        return element == part_config.gpio_pin;
      });
      if (id != -1) {
        part.gpio = new BbbGpio(BbbGpio.pins[id], Installation.mode_test());
        //add/set gpio property
        if (enable_on_create == true) {
          await part.gpio.initialize(
            part_config.inverted_output_device ? 1 : 0
          );
        }
        return part;
      } else {
        throw new Error("ERROR: Bad GPIO config : " + JSON.stringify(part));
      }
    }
  }

  static mode_test() {
    // get live for bones
    if (os.hostname().indexOf("bone") > 0) {
      return "live";
    }
    //mock all others.
    return "mock";
  }
  //#endregion
  //#region GET
  get_array_details() {
    return this;
  }
  get_effect_details(id) {
    return {
      part: this.parts[id],
      gpio_mode: Installation.mode_test()
    };
  }
  //#endregion
  //#region POST
  async enable_effect(id) {
    console.log("[Installation]: Enable Effect Id: ", id);
    this.parts[id].gpio = new BbbGpio(part.gpio_pin, Installation.mode_test());
    await part.gpio.initialize(0);
    return part;
  }
  async reconfigure(part_id, key, value) {
    console.log(
      "[Installation]: Reconfigure Effect Request: ",
      part_id,
      key,
      value
    );
    if (part_id != null) {
      if (key in this.parts[part_id]) {
        switch (key) {
          case "gpio":
            const part_to_disable = this.parts.find(element => {
              return (
                BbbGpio.pins[element.gpio.id] == value && element.id != part_id
              );
            });
            if (part_to_disable != undefined) {
              await this.disable_effect(part_to_disable.id, true);
            }
            this.parts[part_id].part.gpio = value;
            this.parts[part_id].gpio = null;
            break;
          default:
            this.parts[part_id].part[key] = value;
            break;
        }
      } else {
        console.error(" [Installation]: Key Not Found. ", key);
      }
    } else {
      console.error("[Installation]: Bad Id: " + part_id);
    }
    return this.parts[part_id];
  }
  //#endregion
  //#region DELETE
  async master_shut_off(graceful) {
    console.log("[Installation]:  Master Shut Off Start");
    const disable_all_effects = this.parts.map(async (part, i) => {
      const result = await this.disable_effect(i, graceful);
      return result;
    });
    const msg = await Promise.all(disable_all_effects);
    console.log("[Installation]: Master Shut Off Complete");
    return msg;
  }

  async disable_effect(part_index, graceful) {
    console.log("[Installation]: Disable Effect Id: ", part_index);
    if (graceful) {
      await this.parts[part_index].gpio.set_value(0);
      this.parts[part_index].gpio = null;
      return this.parts[part_index];
    } else {
      this.parts[part_index].gpio = null;
      return this.parts[part_index];
    }
  }
  //#endregion
}
