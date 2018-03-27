import React from "react";
import ajax_adapter from "../AjaxAdapter";

export default class ToggleButton extends React.Component {
  constructor(props) {
    super(props);
    /*
      props = {
      id: server's id for the device this controls,
      text: button text,
      on_state_text: Display text for when the associated device is on/active
      off_state_text: Display text for when the associated device is off
      endpoints : {
        on: ajax_props {},
        off: ajax_props {}
        }
      }
    */

    this.state = {
      on: false
    };
    this.toggle = this.toggle.bind(this);
  }
  async toggle() {
    var result;
    if (this.state.on == true) {
      result = await ajax_adapter(this.props.endpoints.off);
    } else {
      result = await ajax_adapter(this.props.endpoints.on);
    }
    console.log(result);
    //TODO: conditionally set state based on result success.
    this.setState(prev_state => {
      return { on: !prev_state.on };
    });
  }

  render() {
    return (
      <button onClick={this.toggle}>
        {this.state.on == true ? "Clear " : "Light "}
        {this.props.text}
      </button>
    );
  }
}
