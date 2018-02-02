import gpio from './gpio_model'

export default class System {
  constructor()  {
    this.values = {
      "pins": {
        "gpio": gpio.gpio_pins,
        "power_relay": gpio.power_relay_pin
      }
    }
  }
}
