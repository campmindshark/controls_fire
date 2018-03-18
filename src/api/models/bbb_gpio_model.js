import './file_utils';
import fs from 'fs';

const base_path = '/sys/class/gpio/gpio';

export default class BbbGpio {
    constructor(pin, mode) {
        this.pin = pin;

        this.mode = mode;

        this.raw_value = null;
        this.active_low = null;
        this.direction = null;
        this.edge = null;

        this.path = this.build_path(mode, this.pin);
        this.initialize = this.initialize.bind(this);
        this.load_all_pin_values = this.load_all_pin_values.bind(this);
        this.get_value = this.get_value.bind(this);
        this.set_value = this.set_value.bind(this);
    }

    async initialize(init_value) {
        await this.load_all_pin_values(init_value);
    }

    async load_all_pin_values(init_value) {
        console.log('[Gpio Init]: Start for Pin: ' + this.pin + '\n');
        var raw_value = await fs.readFileAsync(this.path + 'value');
        var active_low = await fs.readFileAsync(this.path + 'active_low');
        var direction = await fs.readFileAsync(this.path + 'direction');
        var edge = await fs.readFileAsync(this.path + 'edge');

        this.raw_value = raw_value.trim();
        this.active_low = active_low.trim();
        this.direction = direction.trim();
        this.edge = edge.trim();
        //set and clean file data
        console.log('\n' + Date.now());
        console.log('\n[Gpio Init]: Values Loaded');

        var initial_corrected = this.active_low_corrected_value(init_value);
        if (initial_corrected != this.raw_value) {
            await this.set_value(initial_corrected);
            console.log('\n[Gpio Init]: Initial Value Set for pin: ' + this.pin);
        }
        return;
    }
    static get pins() {
        return [30, 31, 48, 5, 3, 49, 117, 115, 111, 110, 20, 60, 50, 51, 4, 2,
            15, 14, 113, 112, 7, 38, 34, 66, 69, 45, 23, 47, 27, 22, 62,
            36, 32, 86, 87, 10, 9, 8, 78, 76, 74, 72, 70, 39, 35, 67, 68, 44,
            26, 46, 65, 63, 37, 33, 61, 88, 89, 11, 81, 80, 79, 77, 75, 73,
            71
        ];
    }
    //#region Properties
    async get_value() {
        if(this.raw_value != null)
        {
            var val = await fs.readFileAsync(this.path + 'value');
            this.raw_value = val.trim();
        }
        return this.active_low_corrected_value(this.raw_value);

    }

    async set_value(value) {
        if (this.raw_value === null) {
            console.error('Cannot Command Disabled Effect');
        }
        var new_value = this.active_low_corrected_value(value);
        this.raw_value = await fs.writeFileAsync(this.path + 'value', new_value);
        console.log('\nnew raw value set: ' + JSON.stringify(this));
    }
    //#endregion
    //#region helpers
    id_test(id) {
        if (id < BbbGpio.gpio_pins.length) {
            return id;
        } else {
            throw 'Invalid gpio id. Ids should be sequential integers starting at 0';
        }
    }
    build_path(mode, pin) {

        var mock_path = process.cwd().substring(0, process.cwd().indexOf('src')) + 'mock_gpio';
        var path = (mode == 'mock') ? mock_path : '';
        path += base_path + pin + '/';
        return path;
    }

    active_low_corrected_value(value) {
    //console.log("\nvalue: " + value + "\nactive_low: " + this.active_low);
        return this.active_low == 1 ? 1 - value : value;
    }
    export_and_clear_script(pin) {
        return 'echo ' + pin + ` > /sys/class/gpio/export
cd ` + this.path + `
echo out > direction
echo 0 > value`;
    }
    //#endregion


}
