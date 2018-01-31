export default class ConfigManager {
  constructor(json_config) {
    this.parsed = JSON.parse(json_config);
    console.log(this.parsed);
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
