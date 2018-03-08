/**
 * Created by Administrator on 2017/6/5.
 */

var http = require('http');
//var unit_date = require('../tools/unit-date');
var gm = require('gm').subClass({imageMagick: true});

module.exports = {
  /**
   * http接口请求函数（get方式）
   * @param host  域名或者IP地址 例如：api.wandoujia.com或者192.0.0.1格式
   * @param path  请求路径，例如：/v1/allApps.json
   * @param port  端口号，没有就传 null 值
   * @param method  请求方式
   * @param paramstr  请求所带的参数，例如：id=baoqianli&token='+apiToken+',没有参数就传 null 值
   * @param data  请求传入的数据（字符串形式），没有就是null
   * @param callback  回调函数
   */
  connect:function(host,path,method,req,allParams,callback) {

      //临时变量
      var self = this;
      var allParams = Object.assign({},allParams);
      var options,urlPathStr,i,keysArray,timestamp;

      //保千里应用账号(第三方分配)
      var timestamp = m.timestamp();
      var peapodsid = sails.config.globals.peapodsId;
      var peapodskey = sails.config.globals.peapodsKey;

      var content = peapodsid + peapodskey + timestamp;
      var apitoken = self.cryptoFunc('md5','hex',content);

      urlPathStr = "";
      urlPathStr += path || "";

      allParams.id = 'baoqianli';
      allParams.token = apitoken;
      allParams.timestamp = timestamp;

      for(var keys in allParams) {
          urlPathStr += i ? '&' : '?';
          urlPathStr += keys + "=";
          urlPathStr += allParams[keys];
          i = 1;
      }

      options = {};
      options.port = null;
      options.method = method;
      options.hostname = host;
      options.path = urlPathStr;

      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(allParams.toString()),
      }

      console.log('urlPathStr. check it out. ',host + urlPathStr);

      var param = utils.clone(allParams);
      delete param.token;
      delete param.imei;
      delete param.timestamp;
      delete param.phone_imei;

      var hashCacheKey = dt.hashCacheKey(req.path,param);
      var hashCacheVal = dt.startUpActionCache(hashCacheKey.toString());
      console.log('hashCacheKey. ',hashCacheKey, ' is ', hashCacheVal?true:false);

      if (_.isObject(hashCacheVal)) {
          //hashCacheVal[0].apps = m.changeApps(hashCacheVal[0].apps);
          return callback(null,hashCacheVal);
      }

      var request = http.request(options, function(response){
          var body = "";
          response.setEncoding('utf8');
          response.on('data', function(chunk) {
              body += chunk;
          });
          response.on('error', function (err) {
              callback(err,[]);
          });
          response.on('end', function(){
              try{
                  var json = JSON.parse(body);
                  if (json.length>0) {
                      //json[0].apps = m.changeApps(json[0].apps)
                      // validity.isInsert(hashCacheKey,json);
                      //dt.setHashCacheKey(hashCacheKey,json);
                  }
                  callback(null,json);
              }catch(e){
                  console.log('end: err. ',e);
                  callback(null,[]);
              }
          });
      });

      request.write(urlPathStr);
      request.end();

  },
  /**
   * 图片上传压缩功能
   * @param req  请求对象
   * @param dirname  上传文件名
   * @param isCompress  是否需要压缩
   * @param callback  回调函数
   */
  uploadImg:function(req,dirname,isCompress,callback){
    console.log('image start upload');
    var date = new Date();
    var dir = dirname+ "/" +date.format("yyyy")+ "/" +date.format("MM")+ "/";

    var filePath = sails.config.globals.uploadFilePath + dir;
    var urlPath = sails.config.globals.fileUrl + dir;
    var setting = {maxBytes:150000000000};
    setting.dirname = filePath;

    req.file('data').upload(setting, function (err, uploadFiles) {
      if (err){
        console.log(err);
        return;
      }
      var files = [];
      console.log(uploadFiles,isCompress);
      if (uploadFiles&&uploadFiles.length > 0) {
        if(isCompress){
          console.log("uploadFiles. ",uploadFiles);
          async.mapSeries(uploadFiles,function (theFile,cb) {
            var filename = theFile.fd.substring(theFile.fd.lastIndexOf("/") + 1, theFile.fd.length);
            var webpFile = filename.substring(0,filename.indexOf("."))+".webp";
            var webpPath = filePath + webpFile;
            console.log('filename: ',filename,'\n','webpFile: ',webpFile,'\n','saveDir: ',webpPath);
            //图片压缩
            gm(theFile.fd).compress("Zip").quality(0.5).write(webpPath,function (err) {
              if (err) {
                console.log('gm_err: ',err);
              }
              var item = {
                url: urlPath + filename,
                webp: urlPath + webpFile
              };
              cb(err,item);
            });
          },function (err,ret) {
            callback({code: 200,data: ret});
          });
        }else{
          callback({code: 200,data: files});
        }
      } else {
        callback({code: 400,msg: '上传文件失败'});
      }
    });
  },
  /**
   * 上传文件功能
   * @param req 请求对象
   * @param dir 上传文件的路径，例如：app,pdf
   * @param callback 回调函数
   */
  uploadFile:function(req,dirname,callback){
      console.log('file start upload');
      var dir = dirname+ "/";
      var filePath = sails.config.globals.uploadFilePath + dir;
      var urlPath = sails.config.globals.fileUrl + dir;
      var setting = {maxBytes:150000000000};
      setting.dirname = filePath;

      req.file('data').upload(setting, function (err, uploadFiles) {
          if (err){
              console.log(err);
              return;
          }
          if (uploadFiles&&uploadFiles.length > 0) {
              console.log("upload file's num have ",uploadFiles.length);
              async.mapSeries(uploadFiles,function (theFile,cb) {
                  var filename = theFile.fd.substring(theFile.fd.lastIndexOf("/") + 1, theFile.fd.length);
                  var item = {
                      downloadurl: urlPath + filename
                  };
                  cb(null,item);
              },function (err,ret) {
                  callback({code: 200,data: ret});
              });
          } else {
              callback({code: 400,msg: '上传文件失败'});
          }
      });
  },
  /**
   * 加密函数
   * @param method  加密的方式，例如：md5
   * @param code  编码方式，例如：hex,base64
   * @param content  加密内容
   * @returns {*}  返回加密结果值
   */
  cryptoFunc:function(method,code,content){
      var crypto = require('crypto');
      var s = crypto.createHash(method).update(content);
      var apiToken = s.digest(code);
      return apiToken;
  },

  /**
   * http接口请求函数（get方式）
   * @param host  域名或者IP地址 例如：api.wandoujia.com或者192.0.0.1格式
   * @param path  请求路径，例如：/v1/allApps.json
   * @param port  端口号，没有就传 null 值
   * @param method  请求方式
   * @param paramstr  请求所带的参数，例如：id=baoqianli&token='+apiToken+',没有参数就传 null 值
   * @param data  请求传入的数据（字符串形式），没有就是null
   * @param callback  回调函数
   */
  con:function(host,path,method,allParams,callback) {

      //临时变量
      var self = this;
      var allParams = Object.assign({},allParams);
      var options,urlPathStr,i,keysArray,timestamp;

      //保千里应用账号(第三方分配)
      var timestamp = m.timestamp();
      var peapodsid = sails.config.globals.peapodsId;
      var peapodskey = sails.config.globals.peapodsKey;

      var content = peapodsid + peapodskey + timestamp;
      var apitoken = self.cryptoFunc('md5','hex',content);

      urlPathStr = "";
      urlPathStr += path || "";

      allParams.id = 'baoqianli';
      allParams.token = apitoken;
      allParams.timestamp = timestamp;

      for(var keys in allParams) {
          urlPathStr += i ? '&' : '?';
          urlPathStr += keys + "=";
          urlPathStr += allParams[keys];
          i = 1;
      }

      options = {};
      options.port = null;
      options.method = method;
      options.hostname = host;
      options.path = urlPathStr;

      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(allParams.toString()),
      }

      console.log('urlPathStr. check it out. ',host + urlPathStr);

      var request = http.request(options, function(response){
          var body = "";
          response.setEncoding('utf8');
          response.on('data', function(chunk) {
              body += chunk;
          });
          response.on('error', function (err) {
              callback(err,[]);
          });
          response.on('end', function(){
              try{
                  var json = JSON.parse(body);
                  if (json.length>0) {
                    callback(null,json);
                  }else{
                    callback(null,JSON.parse("[]"));
                  }

              }catch(e){
                  console.log('end: err. ');
                  callback(null,JSON.parse("[]"));
              }
          });
      });

      request.write(urlPathStr);
      request.end();
  },

  getToken: function() {

      var self = this;
      var timestamp = m.timestamp();
      var peapodsid = sails.config.globals.peapodsId;
      var peapodskey = sails.config.globals.peapodsKey;

      var content = peapodsid + peapodskey + timestamp;
      var apitoken = self.cryptoFunc('md5','hex',content);

      return {apitoken,timestamp};
  },
}

