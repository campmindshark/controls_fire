import Effects from './fx_model';
import BbbGpio from './bbb_gpio_model';
import Sqlite3Adapter from './data/sqlite3_adapter'
import fs from 'fs';

export default class System {
  constructor(system_config) {
    this.config = system_config;
    //6 = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    //without having to require sqlite3 in this file
    this.db_adapter = new Sqlite3Adapter(this.config.db_url, 6);
    this.create_db = this.create_db.bind(this);
  }

  create_db() {
    var create_script = fs.readFileSync('./api/models/data/create_db.sql').toString();
    this.db_adapter.query_db(create_script, [], (err) => {
      if (err) {
        console.log('[createSchema] Top-level error', err);
        return;
      }
      console.log('[createSchema] OK');
    });
  }

  build_internal_array(system_parts) {
    if (system_parts != null && system_parts.length > 0) {
      if (system_parts.find((element) => { return element.name === "master_power";}) ) {
        return Effects.build_part_array(system_parts, true);
      } else {
        throw "ERROR: System Parts Array does not have a master_power configured.\nConfigure master_power in system_config.parts";
      }
    } else {
      throw "ERROR: No System Parts Configured.\nYou must configure a master_power part in system_parts at a minimum.";
    }
  }

  get_effects(installation_config) {
    return new Effects(installation_config, this.config);
  }
}
