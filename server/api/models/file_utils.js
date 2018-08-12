const fs = require("fs");

fs.readFileAsync = function(file) {
  return new Promise(resolve => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(
          "Failed to read gpio info: " + "\file: " + file + "\n" + err + "\n"
        );
        throw new Error(err);
      } else resolve(data);
    });
  });
};

fs.writeFileAsync = function(file, data) {
  return new Promise(resolve => {
    fs.writeFile(
      file,
      data,
      {
        encoding: "utf-8",
        flag: "w"
      },
      err => {
        if (err) {
          console.error("Failed to write gpio info: " + "\file: ", file, err);
          throw new Error(err);
        } else resolve(data);
      }
    );
  });
};
