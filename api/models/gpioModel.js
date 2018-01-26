var fs = require('fs');
  export default class gpio {
    constructor(id, init_value) {
      this.id = id;
      this.base_path = "/sys/class/gpio/gpio" + gpio.gpio_pins[this.id] + "/"
      this.raw_value = this.get_from_file("value");
      this.active_low = this.get_from_file("active_low");
      this.direction = this.get_from_file("direction");
      this.edge = this.get_from_file("edge");
      this.power = this.get_from_file("power");
      var initial_corrected = this.active_low_corrected_value(init_value);
      if(initial_corrected != this.raw_value) {
        this.write_to_file("value", initial_corrected);
      }
      console.log(this.toString());
    }

    static gpio_pins = [30,31,48,5 ,3 ,49,117,115,111,110,20
      ,60,50,51,4 ,2 ,15,14 ,113,112,7
      ,38,34,66,69,45,23,47 ,27 ,22 ,62 ,36,32,86,87,10,9 ,8 ,78,76,74,72,70
      ,39,35,67,68,44,26,46 ,65 ,63 ,37 ,33,61,88,89,11,81,80,79,77,75,73,71];

    toString = function() {
      //returns info about this gpio
      return "GPIO ID: " + this.id +
      "\nraw_value: " + this.raw_value +
      "\nactive_low: " + this.active_low +
      "\ndirection: " + this.direction +
      "\nedge: " + this.edge +
      "\npower: " + this.power +
      "\nPath: " + this.base_path;
    }


    get Value() {
      this.raw_value = this.get_from_file("value");
      return this.active_low_corrected_value(this.raw_value);
    }

    set Value(val) {
      new_value = this.active_low_corrected_value(val);
      this.write_to_file("value", new_value);
      this.raw_value = new_value;
    }

    active_low_corrected_value = function(value) {
      return this.active_low == 1 ? 1 - this.value : this.value
    }

    get_from_file = function(file_name) {
      fs.readFile(this.base_path + file_name
        , 'utf8'
        , function(err, file_data) {
          if (err) {
            console.log("Failed to read gpio info"
            + "\nfile_name: " + file_name + "\n"
            + err + "\n");
            return "ERROR";
          }
          return file_data;
        });
      }

      write_to_file = function (file_name, data) {
        fs.writeFile(this.base_path + file_name
          , data
          , function(err) {
            if(err) {
              console.log("Failed to write gpio info: " + this.base_path + "\n" + file_name + "\n" + err + "\n");
              throw err;
            }
            console.log("New state written: " + data);
          });

        }

      }
