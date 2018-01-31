export default class ConfigManager {
  constructor(json_config) {
    var config = JSON.parse(json_config);
    var parts = config.parts;
    console.log(config);
    console.log(parts);

  }

  static build_demo_array = function() {
    //just a dummy array of 12 effects
    var fxs = [];
    for(var i=0; i<12; i++) {
      fxs[i] = "init";
    }
    return fxs;
  }

  value = function(key) {
    //TODO: check for key first
    return this.parsed[key];
  }
}
