var fs = require('fs');

fs.readFileAsync = function(file) {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    console.error("Failed to read gpio info: " +
                        "\file: " + file + "\n" +
                        err + "\n");
                    reject(err);
                } else resolve(data);
            });
        } catch (err) {
            console.error("Failed to read gpio info: " +
                "\file: " + file + "\n" +
                err + "\n");
            reject(err);
        }
    });
};

fs.writeFileAsync = function(file, data) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFile(file, data, {
                encoding: 'utf-8',
                flag: 'w'
            }, (err) => {
                if (err) {
                    console.error("Failed to write gpio info: " +
                        "\file: " + file + "\n" +
                        err + "\n");
                    reject(err);
                } else resolve(data);
            });
        } catch (err) {
            console.error("Failed to write gpio info: " +
                "\file: " + file + "\n" +
                err + "\n");
            reject(err);
        }
    });
};
