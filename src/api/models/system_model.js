import Effects from './fx_model';
import BbbGpio from './bbb_gpio_model';
import Sqlite3Adapter from './data/sqlite3_adapter';
import ScriptBuilder from './data/scripts/script_builder';
import fs from 'fs';

export default class System {
  constructor(system_config, installation_config, callback) {
    //TODO:Stop exposing a deep copy of the config.
    //All this info should be available elsewhere
    this.config = JSON.parse(JSON.stringify(system_config));
    this.effects = [];
    this.parts = [];

    build_data_layer(this, callback,
      (err, system, final_callback) => {
        if (err) {
          console.log('[System Initialization]: FAIL');
          console.log("[System Initialization]: Failed to build data layer");
          final_callback(err);
        }
        build_internal_array(this, callback,
          (err, system, parts) => {
            if (err) {
              console.log('[System Initialization]: FAIL');
              console.log('[System Initialization]: Failed to build system parts array');
              callback(err);
            }
            system.parts = parts;
            system.effects = new Effects(installation_config, system_config, callback);
            console.log('\n[System Initialization]: Complete');
          });
      });

    function build_data_layer(system, final_callback, callback) {
      var data_map = system.config.data_map;
      //6 = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      //without having to require sqlite3 in this file
      var dba = new Sqlite3Adapter(data_map.db_url, 6);

      drop_create_tables(system,
                         dba,
                         ScriptBuilder.get_scripts(data_map.tables),
                         (err) => {
                           if (err) {
                             final_callback(err);
                           }
                           callback(null, system, final_callback);
                         });

      function drop_create_tables(system, dba, drop_create_scripts, callback) {
        var table_scripts = drop_create_scripts.shift();
        dba.nonquery_db(dba.run_query, table_scripts.drop_script, [], (err) => {
          if (err) {
            //tolerate failed drop attempts
            console.log('\n[DropTable] Failed:', err);
          }
          console.log('\n[DropTable] OK');
          console.log('\nBegin [CreateTable]');
          dba.nonquery_db(dba.run_query, table_scripts.create_script, [], (err) => {
            if (err) {
              //close the connection and fail
              callback(err);
            }
            console.log('\n[CreateTable] OK');
            if (drop_create_scripts.length > 0) {
              drop_create_tables(system, dba, drop_create_scripts, callback);
            } else {
              callback(null);
            }
          });
        });
      }
    }

    function build_internal_array(system, final_callback, callback) {
      var system_parts = JSON.parse(JSON.stringify(system.config.parts));
      if (system_parts != null && system_parts.length > 0) {
        if (system_parts.find((element) => {
            return element.name === "master_power";
          })) {
          Effects.build_part_array(system_parts, true, final_callback, (err, parts, final_callback) => {
            if (err) {
              final_callback(err);
            }
            callback(null, system, parts);
          });
        } else {
          final_callback("ERROR: System Parts Array does not have a master_power configured.\nConfigure master_power in system_config.parts");
        }
      } else {
        final_callback("ERROR: No System Parts Configured.\nYou must configure a master_power part in system_parts at a minimum.");
      }
    }
  }
}
