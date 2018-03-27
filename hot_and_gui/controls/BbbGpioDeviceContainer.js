import React from "react";
import MomentaryButton from "./MomentaryButton";
import ToggleButton from "./ToggleButton";

export default class BbbGpioDeviceContainer extends React.Component {
  constructor(props) {
    super(props);
    /*
      props = {
        key: server's id for the device this controls,
        base_url: base api url
        part_config: from server
      }
    */
  }
  get_binary_endpoints() {
    return {
      on: get_toggle_btn_ajax_props(this.props.id, this.props.base_url, 1),
      off: get_toggle_btn_ajax_props(this.props.id, this.props.base_url, 0)
    };
    function get_toggle_btn_ajax_props(id, url, state) {
      return {
        url: url,
        verb: "POST",
        controller: "fxs",
        params: {
          path: id,
          body: {
            set_state: state
          }
        }
      };
    }
  }

  render() {
    var DeviceButton =
      this.props.part_config.type == "outlet" ? MomentaryButton : ToggleButton;
    return (
      <div>
        <DeviceButton
          key={this.props.id}
          id={this.props.id}
          text={
            this.props.part_config.type == "outlet"
              ? "Effect Solenoid"
              : "Supply Solenoid"
          }
          endpoints={this.get_binary_endpoints()}
        />
      </div>
    );
  }
}
