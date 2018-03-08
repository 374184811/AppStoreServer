/**
 * Created by Administrator on 2017/6/5.
 */

var http = require('http');
//var unit_date = require('../tools/unit-date');
var gm = require('gm').subClass({imageMagick: true});
var apktool = require("node_apktool");
var querystring = require('querystring');
module.exports = {
  /**
   * http接口请求函数（get方式）
   * @param host  域名或者IP地址 例如：api.wandoujia.com或者192.0.0.1格式
   * @param path  请求路径，例如：/v1/allApps.json
   * @param port  端口号，没有就传 null 值
   * @param method  请求方式
   * @param params 请求所带的参数，例如：get方式传--id=baoqianli&token='+apiToken+',post方式传对象，没有参数就传 null 值
   * @param data  请求传入的数据（字符串形式），没有就是null
   * @param callback  回调函数
   */
  httpServer:function(host,path,port,method,params,data,callback){
      // 豌豆荚保千里id：baoqianli，保千里key：cfe71f1f06424bb186571b2414656815
      //加密算法
      var content = sails.config.globals.peapodsId + sails.config.globals.peapodsKey;
      var timestamp = m.timestamp() + '';
      if(data != null){
          content += JSON.stringify(data);
      }else{
          content += timestamp;
      }
      var apiToken = this.cryptoFunc('md5','hex',content);

      var options = {},pathStr = '',param = '';
      if(method == 'get'){
          param += 'id=baoqianli&token='+apiToken+'&timestamp='+timestamp;
          if(params != null){
              param += '&' + params;
          }
          pathStr += path + '?' + param;

          options = {
              hostname : host,
              path: pathStr,
              method: method,
              timeout: 5000,
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              }
          };

          console.log(new Date().format('yyyy-MM-dd hh:mm:ss.S'),' --- urlpath is : ',host + pathStr);
      } else if (method == 'post'){
          var postData = querystring.stringify({
              'id' : 'baoqianli',
              'token' : apiToken,
              'timestamp' : timestamp,
              'data' : JSON.stringify(data),
              'sdkVersion' : params.sdkVersion,
              'phone_imei' : params.phone_imei
          });
          param = postData;

          options = {
              hostname : host,
              path: path,
              method: method,
              data: postData,
              timeout: 5000,
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(postData)
              }
          };

          console.log(new Date().format('yyyy-MM-dd hh:mm:ss.S'),' --- options is : ',options);
      }

      try{
          var request = http.request(options, function(response){
              var body = "";
              response.setEncoding('utf8');
              response.on('data', function(chunk) {
                  body += chunk;
              });

              response.on('error', function (err) {
                  console.log('error with response: ',err);
                  callback(err,[]);
              });
              response.on('end', function(){
                  try{
                      var json = JSON.parse(body);
                      callback(null,json);
                  }catch(e){
                      console.log('\nexception : ',e,body);
                      callback({e:e},[]);
                  }
              });
          });

          request.on('error', function(e) {
              console.error('error with request: ',e);
              callback(e,[]);
          });

          request.write(param);
          request.end();
      }catch(err){
          console.log('error with options: ',err, " ----- ",JSON.stringify(options));
          callback(err,[]);
      }
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
      var self = this;
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
                  var str = urlPath + filename;
                  var filePath = str.substr(1,str.length-1);
                  self.getAppMsg(filePath,function(e,data){
                      if(e){
                          cb(e,item);
                      }else{
                          item.appMsg = data;
                          cb(null,item);
                      }
                  });
              },function (err,ret) {
                  if(err){
                      callback({code: 401,msg:'获取apk信息出错'});
                  }else{
                      callback({code: 200,data: ret});
                  }
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
   * 导出数据为xlsl文件
   * @param res
   * @param data 导出的数据
   * @param filename 导出文件的名字
   * @returns {*|number}
   */
  exportExcelList: function(res,filename,data){
      var colsInfo = [];
      var colsInfo3 = [];
      var typename = 'string';
      var fileName = filename || 'report.xlsx';
      var conf ={};conf.stylesXmlFile = "styles.xml";
      var nodeExcel = require('excel-export');
      for (var i = 0; i < data.length; i++) {
          var colsInfo2 = [];
          for (var key in data[i]) {
              if(i == 0){
                  typename = 'string';
                  if( typeof data[i][key] == 'number'){typename = 'number';}
                  if( typeof data[i][key] == 'date'){typename = 'date';}
                  if( typeof data[i][key] == 'bool'){typename = 'bool';}
                  //对应字段的key最为第一列
                  colsInfo.push({caption:key,type:typename,width:10});
              }
              //对应字段的数据
              colsInfo2.push(data[i][key]);
          }
          colsInfo3.push(colsInfo2);
      }
      conf.cols = colsInfo;
      conf.rows = colsInfo3;
      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      return res.end(result, 'binary');
  },
  /**
   * 获取apk文件的信息
   * @param filepath 文件路径
   * @param cbfunc 回调函数
   */
  getAppMsg:function(filepath,cbfunc){
      var exec = require('child_process').exec;
      var strReg = /^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)/g;
      console.log(filepath);
      var cmdpath = sails.config.globals.aaptCMD;
      var rootPath = sails.config.globals.uploadFilePath;
      var fileDir = filepath.replace(strReg,"");
      var aaptPath = cmdpath + 'aapt dump badging ' +rootPath+fileDir;

      exec(aaptPath,function(error,stdout,stderr){
          if (error||stderr) {
              console.log('exec error: ' + error,stderr);
              return;
          }
          // console.log(stdout);
          var str = stdout.toString();
          var packageNameAnalysis1 = String(str.match("name='.*' versionCode"));
          var packageNameAnalysis2 = String(packageNameAnalysis1.match("'.*'"));
          var packageName = packageNameAnalysis2.substring (1,packageNameAnalysis2.indexOf('\'',1));//取包名
          // console.log("packageName",packageName);

          var versionCodeAnalysis1=String(str.match("versionCode='.*' versionName"));
          var versionCodeAnalysis2=String(versionCodeAnalysis1.match("'.*'"));
          var versionCode=versionCodeAnalysis2.substring (1,versionCodeAnalysis2.indexOf('\'',1));//取系统版本
          // console.log("versionCode",versionCode);

          var versionNameAnalysis1=String(str.match("versionName='.*'"));
          var versionNameAnalysis2=String(versionNameAnalysis1.match("'.*'"));
          var versionName=versionNameAnalysis2.substring (1,versionNameAnalysis2.indexOf('\'',1));//取版本号
          // console.log("versionName",versionName);

          var sdkVersionAnalysis1=String(str.match("sdkVersion:'.*'"));
          var sdkVersionAnalysis2=String(sdkVersionAnalysis1.match("'.*'"));
          var sdkVersion=sdkVersionAnalysis2.substring (1,sdkVersionAnalysis2.indexOf('\'',1));//取SDK版本号
          //console.log(sdkVersion);

          var applicationLabelAnalysis1=String(str.match("application-label:'.*'"));
          var applicationLabelAnalysis2=String(applicationLabelAnalysis1.match("'.*'"));
          var applicationLabel=applicationLabelAnalysis2.substring (1,applicationLabelAnalysis2.indexOf('\'',1));//取应用名称
          // console.log(applicationLabel);

          var appMsg = {};
          appMsg.packageName = packageName;
          appMsg.versionCode = parseInt(versionCode);
          appMsg.versionName = versionName;

          //获取apk签名md5
          apktool.settings.apkToolPath = sails.config.globals.apkToolPath;
          apktool.readSign(rootPath+fileDir,function(err,result){
              if(err){
                  console.log(err);
                  appMsg.cerStrMd5 = "";
                  return cbfunc(err,appMsg);
              }
              // console.log('apk data :  --- ',result);
              var cerStrMd5 = result.data.MD5.replace(/:/g,"").toLowerCase() || "";
              appMsg.cerStrMd5 = cerStrMd5;
              return cbfunc(null,appMsg);
          });
      });
  },
  /**
   * 获取apk文件签名信息(包括签名MD5、sha加密等)
   * @param filepath
   * @param cbfunc
   */
  getApkCers:function(filepath,cbfunc) {
      console.log(filepath);
      apktool.settings.apkToolPath = sails.config.globals.apkToolPath;
      var rootPath = sails.config.globals.uploadFilePath;
      apktool.readSign(rootPath+filepath,function(err,result){
          if(err){
            logger.writeErr(err);
            return cbfunc(err,[]);
          }
          console.log(result);
          var cerStrMd5 = result.data.MD5.replace(/:/g,"").toLowerCase() || "";
          return cbfunc(null,{cerStrMd5:cerStrMd5});
      });
  },
  /**
   * 获取apk文件md5的值
   * @param filepath
   * @param cbfunc
   */
  getApkMd5:function(filepath,cbfunc){
      console.log(filepath);
      apktool.settings.apkToolPath = sails.config.globals.apkToolPath;
      apktool.getMd5(filepath,function(err,result){
          if(err){
              logger.writeErr(err);
              return cbfunc(err,[]);
          }
          console.log(result);
          var fileMd5 = result.data.MD5 || '';
          return cbfunc(null,{fileMd5:fileMd5});
      });
  }
}
