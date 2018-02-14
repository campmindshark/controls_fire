import Sqlite3Adapter from './sqlite3_adapter';

export default class PartData {
  constructor(parts) {
    if (parts.length > 0) {

    }
  }

  get_part_data(installation, part_id) {

  }

  save_part_data(installation, part) {
    var script = "INSERT OR REPLACE INTO tblParts(gpio_pin)\n" +
                "VALUES ( " + part.gpio + " )";

  }
}
