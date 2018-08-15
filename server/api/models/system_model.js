import Installation from "./installation_model";
import os from "os";

export default class System {
  constructor(system_config, installation_config) {
    this.parts = system_config.parts;
    this.installation = installation_config;
  }
  initialize() {
    return new Promise(async resolve => {
      const sys_parts = await build_internal_array(this.parts);
      this.parts = sys_parts;
      const installations = this.installation.installations;
      for (let i = 0; i < installations.length; i++) {
        console.log("[System]: Config Check:" + installations[i].name);
        if (match_device_ip(installations[i].ip) == true) {
          console.log("[System]: Installation Ip matched");
          console.log("[System]: IP: ", installations[i].ip);
          this.installation = new Installation(installations[i]);
          await this.installation.initialize();
          console.log("\n[System]: Initialization Complete");
          resolve();
        }
      }
      async function build_internal_array(parts) {
        if (parts != null && parts.length > 0) {
          if (config_check(parts) == true) {
            parts = await Installation.build_part_array(parts, true);
            return parts;
          } else {
            build_error(
              "[System]: Initialization Error: No master_power Configured."
            );
          }
        } else {
          build_error(
            "[System]: Initialization Errror: No System Parts Configured."
          );
        }
        function config_check(system_parts) {
          return (
            system_parts.find(part => {
              return part.name == "master_power";
            }) != null
          );
        }
        function build_error(err) {
          console.error(
            "[System]: Initialization Error: Failed to build system parts array"
          );
          throw new Error(err);
        }
      }
      function match_device_ip(ip) {
        const ifaces = os.networkInterfaces();
        let matched = false;
        Object.keys(ifaces).forEach(function(ifname) {
          let alias = 0;
          ifaces[ifname].forEach(function(iface) {
            if ("IPv4" !== iface.family || iface.internal !== false) {
              // skip over localhost and non-ipv4 addresses
              return;
            }

            if (alias >= 1) {
              // this interface has multiple ipv4 addresses
              console.log(ifname + ":" + alias, iface.address);
            } else {
              // this interface has only one ipv4 adress
              console.log(
                "[System]: Config Ip:",
                ip,
                "against:",
                ifname,
                iface.address
              );
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
  }
}
