const request = require('request');
const cheerio = require('cheerio');
const ejs = require('ejs');
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

//爬取cnbeta
var mission_cnbeta = request('http://www.cnbeta.com/',function(err,result){

  if(err){
    console.log(err);
  }

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
      obj_arr.push(obj);
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");
        var db_name = "cnbeta"+time_stamp;
        var cnbeta = db.collection(db_name);

          for (i=0; i<obj_arr.length; i++){
            cnbeta.insert({title:obj_arr[i].title,href:obj_arr[i].href,img:obj_arr[i].img});
          }

        db.close();
    });
});

//爬取ithome并
var mission_ithome = request('http://www.ithome.com/#',function(err,result){
  if(err){
    console.log(err);
  }
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
      obj_arr.push(obj);
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");
        var db_name = "ithome"+time_stamp;
        var cnbeta = db.collection(db_name);
        var ithome = db.collection(db_name);

          for (i=0; i<obj_arr.length; i++){
            ithome.insert({title:obj_arr[i].title,href:obj_arr[i].href});
          }

        db.close();
    });
});
