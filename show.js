const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const schedule = require('node-schedule');

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/crawl_test';



var toCrawl = function(){
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

  //若每天爬虫结果已生成，则不执行任何操作，否则进行爬虫，将数据写入数据库，并生成html文件
  if(fs.existsSync("./"+file_name)){
    console.log("本地文件已存在，若想重新爬虫请删除本地文件");
    return false;
  }else{
  /******************************************************************************
  1.爬cnbeta,并将数据写入数据库
  ******************************************************************************/
  var mission_cnbeta = request('http://www.cnbeta.com/',function(err,result){
    var title = new Array();
    var href = new Array();
    var img = new Array();
    var obj_arr = new Array();
    var html = '';
    function ObjNew(){};

     var $ = cheerio.load(result.body);
     $('dt>a').each(function(index,element){
        title.push($(element).text());
        href.push($(element).attr('href'));
      });
      $('dd+a>img').each(function(index,element){
        img.push($(element).attr('src'));
      })
      for(var i=0; i<title.length;i++){
        var obj = new ObjNew();
        obj.title = title[i];
        obj.href = href[i];
        obj.img = img[i];
        obj.form = "cnbeta";
        obj_arr.push(obj);
      }

      MongoClient.connect(DB_CONN_STR, function(err, db) {
          console.log("连接成功！");
          var cnbeta = db.collection(time_stamp);

            for (i=0; i<obj_arr.length; i++){
              cnbeta.insert({title:obj_arr[i].title,href:obj_arr[i].href,img:obj_arr[i].img,form:obj_arr[i].form});
            }

          db.close();
      });
  });

  /******************************************************************************
  2.爬ithome,并将数据写入数据库
  ******************************************************************************/
  var mission_ithome = request('http://www.ithome.com/#',function(err,result){
    var title = new Array();
    var href = new Array();
    var obj_arr = new Array();
    var html = '';
    function ObjNew(){};

     var $ = cheerio.load(result.body);
     $('.lst.lst-1.new-list li.new span.title>a').each(function(index,element){
        title.push($(element).text());
        href.push($(element).attr('href'));
      });

      for(var i=0; i<title.length;i++){
        var obj = new ObjNew();
        obj.title = title[i];
        obj.href = href[i];
        obj.form = "ithome";
        obj_arr.push(obj);
      }

      MongoClient.connect(DB_CONN_STR, function(err, db) {
          console.log("连接成功！");
          var ithome = db.collection(time_stamp);

            for (i=0; i<obj_arr.length; i++){
              ithome.insert({title:obj_arr[i].title,href:obj_arr[i].href,form:obj_arr[i].form});
            }

          db.close();
      });
  });


  }
}


function toRender(){
  MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    var newsdb = db.collection(time_stamp);
    newsdb.find({title:{$type:2}}).toArray(function(err, docs) {
      ejs.renderFile('./views/1.ejs',{json:{docs:docs}},function(err,data){
        fs.writeFile(file_name,data,function(err){
            console.log("write cnbeta success");
        });
      });
  });
  db.close();
  });
}
schedule.scheduleJob('* 5 * * * *', function(){
  toCrawl();
});

schedule.scheduleJob('* 6 * * * *', function(){
  toRender();
});
