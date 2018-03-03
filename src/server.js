/* jshint -W014 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import os from 'os';
import System from './api/models/system_model';

var app = express(),
  port = process.env.PORT || 5000,
  routes = require('./api/routes/fx_routes'),
  //sqlite3 = require('sqlite3').verbose(),
  //TODO: add endpoint to load config
  sys_config = require('./system_config.json'),
  installation_config = require('./installation_config.json');

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//TODO: System object should manage master_power relay
app.locals.system = new System(sys_config, installation_config, (err) => {
  if(err) {
    console.error(err);
    throw err;
  }
  //TODO: set master_power relay(s) to ON
  console.log('\nSet Routes');
  routes.routes(app);
  console.log('\nBegin Listening');
  app.listen(port);
  console.log("Device: " + os.hostname() + '\n');
  console.log('Rejoice. You may now control Fire on port: ' + port);
});

var match_device_id = (ip) => {
  var ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
      if (iface.address.toString().match(ip)) {
        return true;
      }
    });

    return false;
  });
}
