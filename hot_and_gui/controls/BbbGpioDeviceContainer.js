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

  render() {
    var type = this.props.part_config.type;
    var DeviceButton = type == "outlet" ? MomentaryButton : ToggleButton;
    var btn_txt = get_button_text(type);
    var live_control_endpoints = get_live_control_endpoints(
      this.props.id,
      this.props.base_url
    );
    var enable_endpoints = get_enable_endpoints(
      this.props.id,
      this.props.base_url
    );
    return (
      <div>
        <span>
          <ToggleButton
            key={"enable" + this.props.id}
            id={this.props.id}
            text={btn_txt}
            endpoints={enable_endpoints}
          />
          <DeviceButton
            key={"live" + this.props.id}
            id={this.props.id}
            text={btn_txt}
            endpoints={live_control_endpoints}
          />
        </span>
      </div>
    );
    function get_enable_endpoints(id, url) {
      return {
        on: {
          url: url,
          verb: "POST",
          controller: "fxs",
          params: {
            body: {
              fxId: id
            }
          }
        },
        off: {
          url: url,
          verb: "DELETE",
          controller: "fxs",
          params: {
            path: id
          }
        }
      };
    }
    function get_live_control_endpoints(id, url) {
      return {
        on: get_toggle_btn_ajax_props(id, url, 1),
        off: get_toggle_btn_ajax_props(id, url, 0)
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

    function get_button_text(type) {
      var text;
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
  }
}
