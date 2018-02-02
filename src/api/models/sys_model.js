import gpio from './gpio_model'

export default class System {
  constructor()  {
    //lazy load system values on create.
    this.values = {
      "pins": {
        "gpio": gpio.gpio_pins,
        "master_power": gpio.master_power_pin
      }
    }
  }
}
