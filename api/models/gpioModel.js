import "./file_utils";
var fs = require('fs');

export default class gpio {
  constructor(id, mode, init_value) {
    this.active_low;
    this.direction;
    this.edge;
    this.id         = this.set_id(id);
    this.mode       = mode;
    this.path       = this.build_path(mode, gpio.gpio_pins[id]);
    this.power;
    this.raw_value;

    //Async - Lazy load initial state of gpio files
    var files = [ "value"
    , "active_low"
    , "direction"
    , "edge"
    , "power"].map(
      (file_name) =>
      {
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

          console.log(JSON.stringify(this));

          var initial_corrected = this.active_low_corrected_value(init_value);
          if(initial_corrected != this.raw_value) {
            this.Value = initial_corrected;
          }

          console.log(Date.now());
          console.log("\ngpio init complete\n");
      });
    }

    static base_path = "/sys/class/gpio/gpio";

    static gpio_pins = [30,31,48,5 ,3 ,49,117,115,111,110,20
      ,60,50,51,4 ,2 ,15,14 ,113,112,7
      ,38,34,66,69,45,23,47 ,27 ,22 ,62 ,36,32,86,87,10,9 ,8 ,78,76,74,72,70
      ,39,35,67,68,44,26,46 ,65 ,63 ,37 ,33,61,88,89,11,81,80,79,77,75,73,71];

      get Value() {
        fs.readFileAsync("value").then((data) => {
          console.log("readFileAsync callback with data: " + data);
          this.raw_value = data;
        });
        //this.raw_value = file_data;
        return this.active_low_corrected_value(this.raw_value);
      }

      set Value(value) {
        var new_value = this.active_low_corrected_value(value);
        console.log("\nSet attempt: " + new_value);
        fs.writeFileAsync("value", new_value).then((new_value) => {
          console.log("\nnew_value: " + new_value + "\n");
          this.raw_value = new_value;
          console.log("\nnew raw value set: " + JSON.stringify(this));
        });
      }

      active_low_corrected_value = function(value) {
        console.log("\nvalue: " + value + "\nactive_low: " + this.active_low);
        return this.active_low == 1 ? 1 - value : value;
      }

      set_id = function(id) {
        if (id < gpio.gpio_pins.length) {
          //valid id!
          return id;
        } else {
          throw "Invalid gpio id. Ids should be sequential integers starting at 0";
        }
      }

      build_path = function(mode, pin){
        var path = (mode == "mock") ? process.cwd().toString() + "/" + "mock_gpio" : "";
        path += gpio.base_path + pin + "/";
        return path;
      }

      get_from_file = function(file_name) {
        return fs.readFileAsync(this.path + file_name);
      }

}
