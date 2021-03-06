import React from "react";
import MomentaryButton from "./MomentaryButton";
import ToggleButton from "./ToggleButton";

export default class BbbGpioDeviceContainer extends React.Component {
  constructor(props) {
    super(props);
    /*
      props = {
        key: server's id for the device this controls,
        id: server's id for the device this controls,
        base_url: base api url
        part_config: from server
      }
    */
  }
  static get_enable_endpoints(id, url) {
    return {
      on: get_enable_endpoint("POST", { body: { fxId: id } }),
      off: get_enable_endpoint("DELETE", { path: id })
    };
    function get_enable_endpoint(verb, params) {
      const eps = {
        url: url,
        verb: verb,
        controller: "fxs",
        headers: {
          "Content-Type": "application/json"
        }
      };
      eps.params = params;
      return eps;
    }
  }
  static get_live_control_endpoints(id, url) {
    return {
      on: get_toggle_btn_ajax_props(id, url, 1),
      off: get_toggle_btn_ajax_props(id, url, 0)
    };
    function get_toggle_btn_ajax_props(id, url, state) {
      return {
        url: url,
        verb: "POST",
        controller: "fxs",
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          path: id,
          body: {
            set_state: state
          }
        }
      };
    }
  }
  static get_button_text(type) {
    switch (type) {
      case "outlet":
        return "Effect Solenoid";
      case "supply":
        return "Supply Solenoid";
      case "igniter":
        return "Glowfly";
      default:
        return "Unknown Device";
    }
  }

  render() {
    const type = this.props.part_config.type;
    const DeviceButton = type == "outlet" ? MomentaryButton : ToggleButton;
    const btn_txt = BbbGpioDeviceContainer.get_button_text(type);
    const live_control_endpoints = BbbGpioDeviceContainer.get_live_control_endpoints(
      this.props.id,
      this.props.base_url
    );
    const enable_endpoints = BbbGpioDeviceContainer.get_enable_endpoints(
      this.props.id,
      this.props.base_url
    );
    return (
      <div>
        <span>
          <ToggleButton
            key={"enable" + this.props.id}
            id={this.props.id}
            text={{
              on: "Disable ",
              off: "Enable ",
              button: btn_txt
            }}
            endpoints={enable_endpoints}
          />
          <DeviceButton
            key={"live" + this.props.id}
            id={this.props.id}
            text={{
              on: "Clear ",
              off: "Activate ",
              button: btn_txt
            }}
            endpoints={live_control_endpoints}
          />
        </span>
      </div>
    );
  }
}
