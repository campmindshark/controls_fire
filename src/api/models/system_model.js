import Installation from './installation_model';
import BbbGpio from './bbb_gpio_model';
import fs from 'fs';
import os from 'os';

export default class System {
  constructor(system_config, installation_config, callback) {
    this.parts = [];
    var system_parts = JSON.parse(JSON.stringify(system_config.parts));
    build_internal_array(system_parts,
      (err, parts) => {
        if (err) {
          console.error('[System Initialization]: FAIL');
          console.error('[System Initialization]: Failed to build system parts array');
          callback(err);
        }
        this.parts = parts;
        var init_complete_callback = (err) => {
          if (err) {
            callback(err);
          }
          console.log('\n[System Initialization]: Complete');
          callback(null);
        };
        for (var installation of installation_config.installations) {
          console.log("from config:" + installation.ip);
          if (match_device_ip(installation.ip) == true) {
            this.installation = new Installation(installation, init_complete_callback);
            break;
          }
        }
        function match_device_ip(ip) {
            var ifaces = os.networkInterfaces();
            var matched = false;
            Object.keys(ifaces).forEach(function(ifname) {
              var alias = 0;

              ifaces[ifname].forEach(function(iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                  // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                  return;
                }

                if (alias >= 1) {
                  // this single interface has multiple ipv4 addresses
                  console.log(ifname + ':' + alias, iface.address);
                } else {
                  // this interface has only one ipv4 adress
                  console.log(ifname, iface.address);
                }
                ++alias;
                if (iface.address.includes(ip.toString())) {
                  matched = true;
                }
              });
            });
            return matched;
          }
      });

    function build_internal_array(system_parts, callback) {
      if (system_parts != null && system_parts.length > 0) {
        if (system_parts.find((element) => {
            return element.name === "master_power";
          })) {

          Installation.build_part_array(system_parts, true, (err, parts) => {
            if (err) {
              callback(err);
            }
            callback(null, parts);
          });
        } else {
          callback("ERROR: System Parts Array does not have a master_power configured.\nConfigure master_power in system_config.parts");
        }
      } else {
        callback("ERROR: No System Parts Configured.\nYou must configure a master_power part in system_parts at a minimum.");
      }
    }
  }
}
