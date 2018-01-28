var fs = require('fs');

fs.readFileAsync = function(file) {
  return new Promise((resolve,reject) => {
    try {
      fs.readFile(file
        , 'utf8'
        , (err, data) => {
        if(err) {
          console.log("Failed to read gpio info: "
          + "\file: " + file + "\n"
          + err + "\n");
          reject(err);
        }
        else resolve(data);
      });
    }
    catch (err) {
      console.log("Failed to read gpio info: "
      + "\file: " + file + "\n"
      + err + "\n");
      reject(err);
    }
  });
}
