const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const http = require('http');

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/crawl_test';

//获取当前的年月日
var now = new Date().toDateString();
var arr_date = new Array();
for(i=0;i<now.length;i++){
  if(now[i] != " "){
    arr_date.push(now[i]);
  }
}
var time_stamp = arr_date.join("");
var file_name = "result"+time_stamp+".html";

var server = http.createServer(function(req,res){
  fs.readFile(file_name, function (err, data){
    if(err){
      res.write('404');
    }else{
      res.write(data);
    }
    res.end();
  });
});

server.listen(8082);
