import React from "react";
import ajax_adapter from "../AjaxAdapter";
import BbbGpioDeviceContainer from "./BbbGpioDeviceContainer";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        parts: []
      }
    };
  }

  async componentWillMount() {
    var config = JSON.parse(await get_part_config());
    console.log("config", config);
    this.setState(prev => {
      prev.config = config;
      return prev;
    });
    async function get_part_config() {
      var results = await ajax_adapter({
        verb: "GET",
        url: "http://localhost:5000",
        controller: "fxs"
      });
      return results;
    }
  }

  render() {
    var parts = this.state.config.parts;
    var part_markup =
      parts != undefined && parts.length > 0
        ? parts.map((part, i) => {
            return (
              <BbbGpioDeviceContainer
                key={i}
                id={i}
                base_url={"http://localhost:5000"}
                part_config={part}
              />
            );
          })
        : [];
    return <div>{part_markup}</div>;
  }
}
