const fs = require('fs');


writef = function(items){
    const jsonContent = JSON.stringify(items);

    fs.writeFile("./items.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 

}

module.exports = { writef };
