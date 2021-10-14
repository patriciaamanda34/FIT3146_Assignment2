//import fetch from "node-fetch";
//image credit: https://en.wikipedia.org/wiki/Prambanan
//Express foundation: from FIT2095 S2 2021, Monash University
let express = require('express');
let app = express();
const https = require('https')
const http = require('http');
//let XMLHttpRequest = require('xmlhttprequest');
var XMLHttpRequest = require('xhr2');

const xhr = new XMLHttpRequest();


//let router = require('./router.js');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('public'))
const path = require('path');

let ejs = require('ejs');
var SerialPort = require("serialport");
const { nextTick } = require('process');
const Readline = SerialPort.parsers.Readline;
//const parser = new Readline({delimiter:'\r\n'});
let servo1Run = true;
let servo2Run = true;
/*SerialPort.list().then(ports2 => {
    ports2.forEach(function(port) {
       if(ports2.path == 'COM6'){
           port = ports2;
       }
    })});*/
//Micro:bit
var port = new SerialPort("COM6", {
 baudRate: 115200,
 autoOpen: false
 //rtscts: true

}, function(err){
        if (err) {
    return console.log('Error (Micro:Bit): ', err.message)
}});
const parser = new Readline();
port.pipe(parser);

var port2 = new SerialPort("COM9", {
    baudRate: 9600,
    autoOpen: false
}, function (err){
    if(err){
        return console.log("Error (Arduino): ", err.message);
    }});
/*
port.write('main screen turn on', function(err) {
     if (err) {
      return console.log('Error on write: ', err.message);
     }
     console.log('message written');
});
*/
//port.pipe(parser);
port.open(function(err) {
    if (err) {
        return console.log('Error opening port: ', err.message)
      }
      else{
    console.log("Port open");
      }//console.log(port);
    /*SerialPort.list().then(ports2 => {
        ports2.forEach(function(port) {
            console.log(port);
        })});*/
    parser.on('data', (data) => {
        console.log('Received Data: ' + data.toString());
        processData(data);
    });

   
});

port2.open(function(err){
    if (err) {
        return console.log('Error opening port: ', err.message)
      }
      else {
        console.log("Arduino Port open");
    }
});


/*
port.on('data',function(data){
    console.log('DATAAA');
    console.log(data.toString());
}); */

function processData(data) {
    if (data.indexOf('PLAY') == 0) {
        // Handle PLAY 
        console.log("HANDLE PLAY RN");
        

    //    https://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
        //Sending a GET request:

      /*  var options = {
            host: 'localhost',
            port:8080,
            path: '/1'
          };
        var req = http.get(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
           // res.render("index.html");
          //  window.location.assign('/1');
          //res.redirect('/1');
          

        });*/
        //res.redirect('/');
        /*
        xhr.open('GET', 'localhost:8080/1', true);
        try{
            //xhr.send(body);
        xhr.send(null);
        }
        catch(error){
            console.log(error);
        }*/

    //https://stackoverflow.com/questions/247483/http-get-request-in-javascript
    /*fetch("/1").then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
      }).catch(function() {
        console.log("Booo");
      });*/
}};
/*xhr.onreadystatechange=function() {
    if (xhr.readyState==4 && xhr.status==200) {
        console.log("ReadyState==4 and status code is 200 (OK)")
      // do stuff here
    }
}*/

app.get('/', function (req,res){
    //Getting arduino to shut off all its lights:
    port2.write("0", function(err){
        if (err) {
            return console.log('Error on write: ', err.message);
            }
            console.log('message written');
    });
    res.render("index.html");
    console.log("running index.html");

});
/*
app.get('/eng/play/1', function (req,res){
    console.log("get play");
    res.render("first.html", {language: "eng", vid: "1"});
 //   return res.redirect("localhost:8080/1");
    //('<script>window.location.href="localhost:8080/1";</script>');
   // res.sendFile(path.join(__dirname, '/views/index.html'));

    //res.render("index.html");
});
*/
app.get('/eng/play/:number', function(req,res) {
    console.log('asdc req params');

    checkParam(req.params.number);

    res.render("first.html", {language: "eng", vid: req.params.number});
});

app.get('/ind/play/:number', function(req,res){
    console.log("get play ID");
    checkParam(req.params.number);
    res.render("first.html", {language: "ind", vid: req.params.number});

});

function checkParam(params){
    if(params == 2){
        console.log("1");
        if(servo1Run){
            servo1Run = false;
            port.write("SERVO1", function(err) {
                if (err) {
                return console.log('Error on write: ', err.message);
                }
                console.log('message written');
            });    
        }
        port2.write("2",function(err) {
            if (err) {
            return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });    
    }
    else if(params==4){
        console.log("2");
        if(servo2Run){
            servo2Run = false;

            port.write("SERVO2", function(err) {
                if (err) {
                return console.log('Error on write: ', err.message);
                }
                console.log('message written');
            });  
        }
        port2.write("4",function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });  
    }
    //Arduinos:
    else if(params==1) {
        port2.write("1", function(err){
            if (err) {
                return console.log('Error on write: ', err.message);
               }
               console.log('message written TO ARDUINO');
        });
    }
    else if(params==3){
        port2.write("3", function(err){
            if (err) {
                return console.log('Error on write: ', err.message);
               }
               console.log('message written TO ARDUINO');
        });
    }
}

app.listen(8080);