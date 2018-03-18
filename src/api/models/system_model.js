import Installation from './installation_model';
import os from 'os';

export default class System {
    constructor(system_config, installation_config) {
        this.parts = system_config.parts;
        this.installation = installation_config;
    }

    async initialize() {
        var sys_parts = await build_internal_array(this.parts);
        this.parts = sys_parts;
        for (var installation of this.installation.installations) {
            console.log('[System Initialization]: from config:' + installation.ip);
            if (match_device_ip(installation.ip) == true) {
                this.installation = new Installation(installation);
                await this.installation.initialize();
                console.log('\n[System Initialization]: Complete');
                break;
            }
        }
        async function build_internal_array(parts) {
            if (parts != null && parts.length > 0) {
                if (config_check(parts)) {
                    parts = await Installation.build_part_array(parts, true);
                    return parts;
                } else {
                    build_error('[System Initialization]: ERROR: System Parts Array does not have a master_power configured.\nConfigure master_power in system_config.parts');
                }
            } else {
                build_error('[System Initialization]: ERROR: No System Parts Configured.\nYou must configure a master_power part in system_parts at a minimum.');
            }

            function config_check(system_parts) {
                return system_parts.find((element) => { return element.name === 'master_power'; });
            }
            function build_error(err) {
                console.error('[System Initialization]: FAIL');
                console.error('[System Initialization]: Failed to build system parts array');
                throw new Error(err);
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
    }


}
