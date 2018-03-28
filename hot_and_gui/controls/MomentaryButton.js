import React from "react";
import ajax_adapter from "../AjaxAdapter";
export default class MomentaryButton extends React.Component {
  constructor(props) {
    super(props);
    /*
      props = {
      id: server's id for the device this controls,
      text: button text,
      endpoints : {
        press: ajax_props {},
        release: ajax_props {}
        }
      }
    */
    this.state = {
      on: false
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }
  onMouseDown() {
    ajax_adapter(this.props.endpoints.on);
    this.setState(prev_state => {
      return { on: true };
    });
  }
  onMouseUp() {
    ajax_adapter(this.props.endpoints.off);
    this.setState(prev_state => {
      return { on: false };
    });
  }
  render() {
    return (
      <button onMouseUp={this.onMouseUp} onMouseDown={this.onMouseDown}>
        {this.state.on == true ? this.props.text.on : this.props.text.off}
        {this.props.text.button}
      </button>
    );
  }
}
