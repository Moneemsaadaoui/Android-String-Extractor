const testFolder = './Files/';
var glob = require("glob");
var path = require('path');
const { spawn } = require('child_process');
var fs = require('fs');
const inquirer = require('inquirer');
const { readdirSync, statSync } = require('fs')
const { join } = require('path')
var resultunique = [];
var javaregex = /setText\(\".+\"\)/;
var xmlregex = /android:text=\"[^@]+\"/;
const readline = require('readline-sync');
var regex = /setText\(\"[a-zA-Z0-9 ]+\"\)/;
var linecount = 0;
var filenames = [];
var currentIndex = 0;
var input;
var parsed = [];
var type = 0;
var Spinner = require('cli-spinner').Spinner;
const replace = require('replace-in-file');
var result=[];


async function getDirectories(src, callback) {
    glob(src + '/**/*', callback);
};
var loaded_strings = [];
var spinner = new Spinner('Starting up .. %s \n');
console.log("This Software is written by Saadaoui abdel moneem , a testament to his laziness :: RRDL");
console.log("▄▄▄  ▄▄▄  ·▄▄▄▄  ▄▄▌\n▀▄ █·▀▄ █·██▪ ██ ██•\n▐▀▀▄ ▐▀▀▄ ▐█· ▐█▌██▪\n▐█•█▌▐█•█▌██. ██ ▐█▌▐▌\n.▀  ▀.▀  ▀▀▀▀▀▀• .▀▀▀ ")


getDirectories('YOUR PATH HERE', function (err, res) {
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    showPrompt();
    var filteredresult = res.filter(element => {
        return element.includes(".java") || element.includes(".xml")
    })
    if (err) {
        console.log('Error', err);
    } else {
        filenames=filteredresult;

    }
}).then(() => {
});

function showPrompt() {
    spinner.stop();

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'type',
                message: 'How may i help you bro?',
                choices: ['JAVA FILES', 'XML FILES', 'REPLACE JAVA', 'REPLACE XML', 'SET PATH'],
            },
        ])
        .then(answers => {
            if (answers.type === 'REPLACE JAVA') {
                SubstituteJAVA("./files/" + "MapViewFragment.java");
            } else if (answers.type === 'REPLACE XML') {
                SubstituteXML("./files/" + "MapViewFragment.java");
            }
            else if (answers.type == 'JAVA FILES') {
                regex = javaregex;
                parse();
            } else if (answers.type === 'XML FILES') {
                regex = xmlregex;
                parse();
            } else {

            }
        });
};


function parse() {
   
        console.log(filenames)
        if (currentIndex < filenames.length - 1) {
            next(filenames[currentIndex])
        }
    
}


// function SubREP() {
//     fs.readdir(testFolder, (err, files) => {
//         files.forEach(file => {
//             filenames.push(file);
//         });
//         console.log(filenames)

//     });
// }

function func(data) {
    linecount++;
    // console.log('count: ' + linecount);
    result += "<string name=" + data[0].toUpperCase().split(' ').join('_') + ">" + data[0].substring(1, data[0].length - 1) + "</string>" + "\r\n";

}

function next(file) {

    console.log("Parsing " + file + "")
    parsed.push(file);
    input = fs.createReadStream(file);
    readLines(input, func);
    if (currentIndex < filenames.length - 1) {
        currentIndex++;
    }
}

process.on('exit', () => {
        fs.appendFileSync("Strings.txt", result, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!" + filenames + parsed);
        })

});




function readLines(input, func) {
    var remaining = '';
    input.on('data', function (data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            var extracted = remaining.match(regex)
            //   func(extracted);
            if (extracted != null) {
                var str = extracted[0].match(/\".+\"/);
                func(str);
            }
            index = remaining.indexOf('\n');
        }
    });

    input.on('close', function () {
        if (currentIndex < filenames.length - 1) {

            next(filenames[currentIndex]);
            console.log(currentIndex)
        }
        console.log("read stream closed");

    })
    input.on('end', function () {
        if (remaining.length > 0) {
        } else {
            // fs.unlinkSync('C:/Users/SP-ABDELMONEEM/Desktop/Parser/Files/'+filenames[currentIndex]);
            // console.log("deleting");

        }
    });
}

// function loadStrings() {
//     var spinner = new Spinner('Fetching Strings For Ya .. %s');
//     spinner.setSpinnerString('|/-\\');
//     spinner.start();
//     files = fs.createReadStream("./Strings.txt");
//     var remaining = '';
//     files.on('data', function (data) {
//         remaining += data;
//         var index = remaining.indexOf('\n');
//         while (index > -1) {
//             var line = remaining.substring(0, index);
//             remaining = remaining.substring(index + 1);
//             //   func(extracted);
//             var str = line.match(/\>[a-zA-Z0-9 ]+\</);
//             if (str != null) {
//                 loaded_strings.push(str[0].substring(1, str[0].length - 1));
//             } index = remaining.indexOf('\n');
//         }

//     });
//     files.on('close', function () {
//         setTimeout(() => {
//             spinner.stop()

//             var unique = [... new Set(loaded_strings)]
//             console.log("\nFetched " + unique.length + " unique results , this should be easy...")
//             SubREP()
//         }, 1000)

//     });
// }


function nextReplace(file) {
    console.log("Replacing " + file + "")

    substitute();

}

function SubstituteJAVA(nameFile) {
    console.log(filenames)
    const options = {
        files: filenames,
        from: /setText\(\".*\"\)/g,
        to: (match) => "setText\(R.string." + match.split("\'").join("").substring(9, match.split("\'").join("").length - 2).toUpperCase().split(' ').join('_') + "\)",
    };

    replace(options)
        .then(results => {
            console.log('DONE');
            //   nextReplace(filenames[currentIndex])
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });
}

function SubstituteXML(nameFile) {
    console.log(filenames)
    const options = {
        files: filenames,
        from: /android:text=\"[^@].*\"/g,
        to: (match) => "android:text=\"@string/" + match.substring(14, match.length - 1).toUpperCase().split(' ').join('_') + "\)",
    };

    replace(options)
        .then(results => {
            console.log('DONE');
            //   nextReplace(filenames[currentIndex])
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });


}