import React from "react";
import xhr from "../xhr";

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
    let result;
    if (this.state.on == true) {
      result = await xhr(this.props.endpoints.off);
    } else {
      result = await xhr(this.props.endpoints.on);
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
