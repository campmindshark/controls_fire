import React from "react";
import PooferButton from "./PooferButton";

export default class App extends React.Component {
  componentDidMount() {
    window.addEventListener("mousedown", this.open_solenoid, false);
    window.addEventListener("mousedown", this.close_solenoid, false);
  }

  render() {
    return (
      <div>
        <div>Your React Node app is set up!</div>
        <div>
          <PooferButton />
        </div>
      </div>
    );
  }
}
