var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var config = require('./config');

var app = express();

mongoose.connect(config.database,function(err){
    if(err){
        console.log('not connect  to database');
    }else{
        console.log('connected to database');
    }
})

app.use(bodyParser.urlencoded({extended:true})); // parse all type of values if false it parse only string

app.use(bodyParser.json());

app.use(morgan('dev')); // console data

app.use(express.static(__dirname+'/public'));

var api = require('./app/routes/api')(app,express);

app.use('/api',api); // add /api in api url 

app.get('*',function(req,res){
    res.sendFile(__dirname + '/public/app/index.html');
});

app.listen(config.port,function(err){
    if(err){
        console.log(err);
    }else{
        console.log('server start port 3200');
    }
})