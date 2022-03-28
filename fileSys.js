let fs = require("fs");

// let fname = require("./hello.txt");
// stats, access, read, write, append

function getStat(filename){
    console.log("Stat : ", filename);
    fs.stat(filename, function(err, content){
        if(err) console.log(err);
        else console.log(content)
    });
}

function checkAccess(filename){
    console.log("Access : ", filename);
    fs.stat(filename, function(err, content){
        err ? console.log("Does not exist"):console.log("Exists")
    });
};

function readFile(filename){
    console.log("read filess:", filename);
    fs.readFile(filename,"utf-8", function(err,data){
        if(err) console.log(err);
        else console.log(data)
    })
};


function writeFile(filename,data){
    console.log("Write filess:", filename);
    fs.writeFile(filename,data, function(err){
        if(err) console.log(err);
    });
};

function appenFile(filename,data){
    console.log("Append files:", filename);
    fs.appendFile(filename,data, function(err){
        if(err) console.log(err);
    });
}

let fname ="hello.txt";
// getStat(fname);
// checkAccess(fname);
// readFile(fname);
// writeFile(fname,"xyz"); // rewrite the file an d the old data get lost
appenFile(fname,"pqr")

