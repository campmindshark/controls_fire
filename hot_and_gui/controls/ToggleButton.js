import React from "react";
import ajax_adapter from "../AjaxAdapter";

export default class ToggleButton extends React.Component {
  constructor(props) {
    super(props);
    /*
      props = {
      id: server's id for the device this controls,
      text: {
        on: "",
        off: "",
        button: ""
      },
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
        {this.state.on == true ? this.props.text.on : this.props.text.off}
        {this.props.text.button}
      </button>
    );
  }
}
