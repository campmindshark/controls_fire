import "./file_utils";
import fs from "fs";

const base_path = "/sys/class/gpio/gpio";

export default class BbbGpio {
  constructor(pin, mode) {
    this.pin = pin;
    this.mode = mode;
    this.enabled = false;
    this.raw_value = null;
    this.active_low = null;
    this.direction = null;
    this.edge = null;

    this.path = this.build_path(mode, this.pin);
    this.initialize = this.initialize.bind(this);
    this.get_value = this.get_value.bind(this);
    this.set_value = this.set_value.bind(this);
  }

  async initialize(init_value) {
    console.log("[Gpio Init]: Start for Pin: " + this.pin);

    const file_data_map = ["value", "active_low", "direction", "edge"].map(
      async file => {
        const data = await fs.readFileAsync(this.path + file);
        return data;
      }
    );

    const file_data = await Promise.all(file_data_map);

    this.raw_value = file_data[0].trim();
    this.active_low = file_data[1].trim();
    this.direction = file_data[2].trim();
    this.edge = file_data[3].trim();
    console.log("[Gpio Init]: Values Loaded", Date.now());
    this.enabled = true;

    const initial_corrected = this.active_low_corrected_value(init_value);
    if (initial_corrected != this.raw_value) {
      await this.set_value(initial_corrected);
      console.log("[Gpio Init]: Initial Value Set for pin: " + this.pin);
    }
    console.log("[Gpio Init]: Complete for Pin " + this.pin);
  }

  static get pins() {
    return [
      30,
      31,
      48,
      5,
      3,
      49,
      117,
      115,
      111,
      110,
      20,
      60,
      50,
      51,
      4,
      2,
      15,
      14,
      113,
      112,
      7,
      38,
      34,
      66,
      69,
      45,
      23,
      47,
      27,
      22,
      62,
      36,
      32,
      86,
      87,
      10,
      9,
      8,
      78,
      76,
      74,
      72,
      70,
      39,
      35,
      67,
      68,
      44,
      26,
      46,
      65,
      63,
      37,
      33,
      61,
      88,
      89,
      11,
      81,
      80,
      79,
      77,
      75,
      73,
      71
    ];
  }
  //#region Properties
  async get_value() {
    if (this.enabled == true) {
      const val = await fs.readFileAsync(this.path + "value");
      this.raw_value = val.trim();
    }
    return this.active_low_corrected_value(this.raw_value);
  }

  async set_value(value) {
    if (this.enabled === false) {
      console.error("Cannot Command Disabled Effect");
    } else {
      const new_value = this.active_low_corrected_value(value);
      this.raw_value = await fs.writeFileAsync(this.path + "value", new_value);
      console.log("[Gpio]: New Raw Value Set for Pin " + this.pin);
    }
  }
  //#endregion
  //#region helpers
  build_path(mode, pin) {
    const mock_path =
      process.cwd().substring(0, process.cwd().indexOf("src")) + "mock_gpio";
    const path = (mode == "mock" ? mock_path : "") + base_path + pin + "/";

    return path;
  }
  active_low_corrected_value(value) {
    return this.active_low == 1 ? 1 - value : value;
  }
  export_and_clear_script(pin) {
    return (
      "echo " +
      pin +
      " > /sys/class/gpio/export\n" +
      "cd " +
      this.path +
      "\necho out > direction" +
      "\necho 0 > value"
    );
  }
  //#endregion
}
