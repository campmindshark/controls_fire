import gpio from './gpio_model';
import os from 'os';

export default class System {
  constructor()  {
    //lazy load system values on create.
    this.values = {
      "pins": gpio.gpio_pins
      }
  }
}
