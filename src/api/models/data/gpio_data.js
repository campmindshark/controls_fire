import Sqlite3Adapter from './sqlite3_adapter';

export default class GpioData {
  constructor(pins) {
    if (pins.length > 0) {
      create_pins(pins);
    } else {
      throw "no pins configured";
    }
  }

  get_gpio_data(installation, part_id) {}

  create_pins(pins) {
    var script = "INSERT OR REPLACE INTO tblGpio(gpio_pin)\n";
    for (var i = 0; i < pins.length; i++) {
      script += "VALUES ( " + pins[i] + " )" + i == pins.length - 1 ? "" : ",";
    }
  }

}
