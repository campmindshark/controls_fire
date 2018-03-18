import os from 'os';
import BbbGpio from './bbb_gpio_model';

export default class Installation {
    constructor(installation_config) {
        this.name = installation_config.name;
        this.version = installation_config.version;
        this.parts = installation_config.parts;
        this.id_test = this.id_test.bind(this);
    }
    //#region Static Methods
    static async build_part_array(parts, enable_on_create = false) {
        if (parts != null && parts.length > 0) {
            if (parts.length > BbbGpio.pins.length) {
                throw new Error('TOO MANY PARTS. Configure fewer parts.');
            }
            for(var i=0; i< parts.length; i++) {
                parts[i] = await build_part(parts[i], enable_on_create);
            }
            console.log(parts);
            return parts;
        } else {
            throw new Error('ERROR: No Parts Configured.\nYou must configure parts to control fire.');
        }

        async function build_part(part_config, enable_on_create) {
            return new Promise(resolve => promise_part_build_async(resolve));
            async function promise_part_build_async(resolve) {
                console.log('begin promise');
                var part = part_config;
                var id = BbbGpio.pins.findIndex((element) => {
                    return element == part_config.gpio_pin;
                });
                if (id != -1) {
                    part.gpio = new BbbGpio(BbbGpio.pins[id], Installation.mode_test());
                    //add/set gpio property
                    if(enable_on_create == true) {
                        await part.gpio.initialize(part_config.inverted_output_device ? 1 : 0);
                    }
                    console.log('resolve promise');
                    resolve(part);
                } else {
                    throw new Error('ERROR: Bad GPIO config : ' + JSON.stringify(part));
                }
            }

        }
    }

    static mode_test() {
    // get live for bones
        if (os.hostname().indexOf('bone') > 0) {
            return 'live';
        }
        //mock all others.
        return 'mock';
    }
    //#endregion
    async initialize() {
        console.log('[Installation Init]: Begin');
        this.parts = await Installation.build_part_array(this.parts);
        console.log('[Installation Init]: Installation parts built');
    }
    //#region GET
    info() {
        return JSON.stringify(this);
    }
    get_array_details() {
        var out_data = [];
        for (var i = 0; i < this.parts.length; i++) {
            out_data[i] = this.get_effect_details(i);
        }
        return JSON.stringify(out_data);
    }
    get_effect_details(id) {
        console.log(this.parts[id].gpio);
        var part = this.parts[id];
        return {
            'id': part.gpio.id,
            'name': part.name,
            'enabled': part.gpio != 'Disabled' ? 'enabled' : 'disabled',
            'type': part.type,
            'gpio_mode': Installation.mode_test(),
            'value': part.gpio.get_value((err) => {
                if (err) {
                    throw err;
                }
            })
        };
    }
    //#endregion
    //#region POST
    enable_effect(id) {
        try {
            var part = this.parts[id];
            part.gpio = new BbbGpio(part.gpio_pin, Installation.mode_test(), 0);
            console.log(this);
            return true;
        } catch (err) {
            return false;
        }
    }
    reconfigure(part_id, key, value) {
        var id = this.id_test(part_id);
        if (id != 'bad id') {
            if (key in this.parts[id]) {
                switch (key) {
                case 'gpio':
                    var part_to_disable = this.parts.find((element) => {
                        return (BbbGpio.pins[element.gpio.id] == value && element.id != id);
                    });
                    if (part_to_disable != undefined) {
                        this.disable_effect(part_to_disable.id, true);
                    }
                    this.parts[id].part.gpio = value;
                    this.parts[id].gpio = 'init';
                    return true;
                default:
                    this.parts[id].part[key] = value;
                    return true;
                }
            } else {
                console.error('Key Not Found. \nUnable to reconfigure key: ' + key + '\n');
            }
        } else {
            console.error('Bad Id: ' + id + '\nUnable to reconfigure.');
        }
        return false;
    }
    //#endregion
    //#region DELETE
    master_shut_off(graceful) {
        try {
            this.parts.forEach(
                (element) => {
                    this.disable_effect(element.id, graceful);
                }
            );
            return true;
        } catch (err) {
            return false;
        }
    }

    disable_effect(id, graceful) {
        try {
            if (graceful) {
                this.parts[id].gpio.set_value(0, (err) => {
                    if (err) {
                        return false;
                    }
                    this.parts[id].gpio = 'disabled';
                    return true;
                });
            }
        } catch (err) {
            return false;
        }
    }
    //#endregion
    //#region Data Tests
    id_test(test_id) {
        if (typeof !isNaN(parseInt(test_id)) && isFinite(test_id) && test_id < this.parts.length) {
            return test_id;
        } else {
            return 'bad id';
        }
    }
    //#endregion

}
