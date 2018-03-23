import React from "react";

export default class PooferButton extends React.Component {
  render() {
    return (
      <button
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}>
        Fire!
      </button>
    );
  }
}
