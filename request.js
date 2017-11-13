const request = require('request');
const fs = require('fs');
const path = require('path');

var options = {
  url:'http://www.cnbeta.com/',
  method:'GET'
};

function callback(err,response,body){
  if(!err && response.statusCode == 200){
    fs.writeFile(path.join(path.dirname(),'raw.html'),body,function(err){
      if(err){
        throw err;
      }
      console.log('wirte raw success');
    });
  }
}

request(options,callback);
