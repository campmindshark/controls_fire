import "./file_utils";
import fs from 'fs';

const base_path = "/sys/class/gpio/gpio";

export default class BbbGpio {
  constructor(pin, mode, init_value) {

    this.pin = pin;

    this.mode = mode;
    this.path = this.build_path(mode, this.pin);

    this.power = null;
    this.raw_value = null;
    this.active_low = null;
    this.direction = null;
    this.edge = null;
    //this.construct_callback = callback;

    //Async - Lazy load initial state of gpio files
    var files = ["value", "active_low", "direction", "edge", "power"].map(
      (file_name) => {
        var fs = require('fs');
        return fs.readFileAsync(this.path + file_name);
      });

    Promise.all(files).then(
      (values) => {
        //set and clean file data
        this.raw_value = values[0].trim();
        this.active_low = values[1].trim();
        this.direction = values[2].trim();
        this.edge = values[3].trim();
        this.power = values[4].trim();

        var initial_corrected = this.active_low_corrected_value(init_value);
        if (initial_corrected != this.raw_value) {
          this.Value = initial_corrected;
        }

        console.log("\n" + Date.now());
        console.log("\ngpio init complete");
        //this.construct_callback(null);
      });
      fs.writeFileAsync("./api/models/data/scripts/shell/gpio" + pin + ".sh", this.export_and_clear_script(this.pin));
      console.log();
  }
  static get pins() {
    return [30, 31, 48, 5, 3, 49, 117, 115, 111, 110, 20, 60, 50, 51, 4, 2,
      15, 14, 113, 112, 7, 38, 34, 66, 69, 45, 23, 47, 27, 22, 62,
      36, 32, 86, 87, 10, 9, 8, 78, 76, 74, 72, 70, 39, 35, 67, 68, 44,
      26, 46, 65, 63, 37, 33, 61, 88, 89, 11, 81, 80, 79, 77, 75, 73,
      71
    ];
  }
  //#region Properties
  get Value() {
    console.log('TEST STRING');
    fs.readFileAsync(this.path + "value").then((data) => {
      //console.log("\nreadFileAsync callback with data: " + data);
      this.raw_value = data;
    });
    return this.active_low_corrected_value(this.raw_value);
  }

  set Value(value) {
    console.log('TEST STRING');
    console.log(this.Value);
    var new_value = this.active_low_corrected_value(value);
    //console.log("\nSet attempt: " + new_value);
    fs.writeFileAsync(this.path + "value", new_value).then((new_value) => {
      //console.log("\nnew_value: " + new_value);
      this.raw_value = new_value;
      console.log("\nnew raw value set: " + JSON.stringify(this));
    });
  }
  //#endregion
  //#region helpers
  id_test(id) {
    if (id < gpio_pins.length) {
      return id;
    } else {
      throw "Invalid gpio id. Ids should be sequential integers starting at 0";
    }
  }

  build_path(mode, pin) {

    var mock_path = process.cwd().substring(0, process.cwd().indexOf("src")) + "mock_gpio";
    var path = (mode == "mock") ? mock_path : "";
    path += base_path + pin + "/";
    return path;
  }

  active_low_corrected_value(value) {
    //console.log("\nvalue: " + value + "\nactive_low: " + this.active_low);
    return this.active_low == 1 ? 1 - value : value;
  }
  //#endregion

  export_and_clear_script(pin) {
    return `echo ` + pin + ` > /sys/class/gpio/export
cd ` + this.path + `
echo out > direction
echo 0 > value`;
  }
}
