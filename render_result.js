const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/crawl_test';


var now = new Date().toDateString();
var arr_date = new Array();
for(i=0;i<now.length;i++){
  if(now[i] != " "){
    arr_date.push(now[i]);
  }
}
var time_stamp = arr_date.join("");
var file_name = "result"+time_stamp+".html";



MongoClient.connect(DB_CONN_STR, function(err, db) {
  console.log("连接成功！");
  var newsdb = db.collection(time_stamp);

  newsdb.find({title:{$type:2}}).toArray(function(err, docs) {
    ejs.renderFile('./views/1.ejs',{json:{docs:docs}},function(err,data){
      fs.writeFile(path.join(path.dirname(),file_name),data,function(err){
          console.log("write cnbeta success");
      });
    });
});
db.close();
});
