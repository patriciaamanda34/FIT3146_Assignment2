//Express foundation: from FIT2095 S2 2021, Monash University
let express = require('express');
let app = express();

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.use(express.static('public'))
const path = require('path');

let ejs = require('ejs');
var SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;

//To make sure that servos only run once per lifetime
let servo1Run = true;
let servo2Run = true;

//Connecting to Micro:bit
var port = new SerialPort("COM6", {
    baudRate: 115200,
    autoOpen: false
}, function(err){
        if (err) {
            return console.log('Error (Micro:Bit): ', err.message)
}});
const parser = new Readline();
port.pipe(parser);

//Connecting to Arduino
var port2 = new SerialPort("COM9", {
    baudRate: 9600,
    autoOpen: false
}, function (err){
    if(err){
        return console.log("Error (Arduino): ", err.message);
}});

//Opening the ports:
//Micro:Bit Port
/*port.open(function(err) {
    if (err) {
        return console.log('Error opening port: ', err.message)
    }
    else {
        console.log("Port open");
    }
    //When receiving data 
    //Not used for the current state of the website
    parser.on('data', (data) => {
        console.log('Received Data: ' + data.toString());
        processData(data);
    }); 
});

//Arduino Port
port2.open(function(err){
    if (err) {
        return console.log('Error opening port: ', err.message)
    }
    else {
        console.log("Arduino Port open");
    }
});*/

//When Micro:Bit receives data:
function processData(data) {
    if (data.indexOf('PLAY') == 0) {
        // Handle PLAY 
        console.log("HANDLE PLAY");
}};

//Home page
app.get('/', function (req,res){
    //Getting arduino to shut off all its lights:
    /*port2.write("0", function(err){
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message 0 written for Arduino');
    });
*/
    //Rendering home page:
    res.render("index.html");
    console.log("running index.html");
});

//English page:
app.get('/eng/play/:number', function(req,res) {

    checkParam(req.params.number);

    //Render the page:
    res.render("first.html", {language: "eng", vid: req.params.number});
});

//Indonesian page:
app.get('/ind/play/:number', function(req,res) {

    checkParam(req.params.number);

    //Render the page:
    res.render("first.html", {language: "ind", vid: req.params.number});
});

//Checks which part of the video it is,
//Then writes serials to either the Arduino or Micro:Bit as needed.
//Input: req.params.number of the app.get requests
/*function checkParam(params){
    if(params == 1){
        port2.write("1", function(err){
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message 1 written to Arduino');
        });
    }
    else if(params == 2){
        if(servo1Run){
            servo1Run = false;
            port.write("SERVO1", function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
                console.log('message written for 1st Servo: Micro:Bit');
            });    
        }
        port2.write("2",function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message 2 written for Arduino');
        });    
    }
    else if(params==3){
        port2.write("3", function(err){
            if (err) {
                return console.log('Error on write: ', err.message);
               }
               console.log('message 3 written to Arduino');
        });
    }
    else if(params==4){
        if(servo2Run){
            servo2Run = false;

            port.write("SERVO2", function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
                console.log('message written for 2nd Servo: Micro:Bit');
            });  
        }
        port2.write("4",function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message 4 written to Arduino');
        });  
    }
}*/

app.listen(8080);