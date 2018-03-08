/**
 *
 *
 * @description :: These controllers are to edit/create app's details/应用编辑
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */
var grabAll = require('./GrabAllController');
 module.exports = {
    /**
     * 后台应用名检测接口
     * @param req
     * @param res
     * @param title
     */
    checkTitle:function(req,res){
      //console.log('checkTitle: This is the function entry. check it out: ', req.allParams());
      if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

      var title = req.param("title", false);
      var id = req.param("id", false);

      appDetails.find({title:title}).exec(function (err,record) {
            if(err) return res.negotiate(err);
            if(record.length&&record[0].id!=id){
                return res.json({
                    code:400,
                    msg:"应用名已存在",
                });
            }else{
                return res.json({
                    "code":200,
                    "msg":"继续，伙计",
                });
            }
        });
    },
    /**
     * 后台应用编辑获取接口
     * @param req
     * @param res
     * @param id
     */
    appDetailsEdit:function(req,res){
      //console.log('appDetailsEdit: This is the function entry. check it out: ', req.allParams());
      if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
      }

      var id = req.param("id", false);

      appDetails.find({id:id}).exec(function (err,record) {
            if(err) return res.negotiate(err);
            //console.log(record);
            if(record.length){
                return res.json({
                    code:200,
                    msg:"Gotcha!",
                    result:record
                });
            }else{
                return res.json({
                    "code":400,
                    "msg":"Not Found",
                });
            }
        });
    }, 
    /**
     * 后台应用编辑上传接口
     * @param req
     * @param res
     * @param appdetails all parameters
     */
    appDetailsEditSave:function(req,res){
      
        //console.log('appDetailsEditSave: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
              return res.json({
                  code: 403,
                  msg: "用户未登录"
              });
        }

        var app = {};
        var memory = {};
        app.id = memory.appId = req.param("id", false);
        app.packageName = memory.packageName = req.param("packageName", false);
        app.versionCode = memory.versionCode = req.param("versionCode", false);
        app.title = memory.title = req.param("title", false);
        app.icons = req.param("icons", false);
        memory.icons = JSON.stringify(req.param("icons", false) ||"{}")
        app.versionName = memory.versionName = req.param("versionName", false);
        app.downloadUrl = memory.downloadUrl = req.param("downloadUrl", false);
        app.md5 = memory.md5 = req.param("md5", false);
        app.categories = memory.categories = req.param("categories", false);
        app.class1 = memory.class1 = req.param("class1", false);
        app.class2 = memory.class2 = req.param("class2", false);
        app.tagline = memory.tagline = req.param("tagline", false);
        app.developer = memory.developer = req.param("developer", false);
        app.permissions = memory.permissions = req.param("permissions", false);
        app.screenshots = req.param("screenshots", false);
        memory.screenshots = JSON.stringify(req.param("screenshots", false) || "{}");
        app.changelog = memory.changelog = req.param("changelog", false);
        app.description = memory.description = req.param("description", false);
        app.updatedAt = memory.updatedAt = (new Date()).format("yyyy-MM-dd hh:mm:ss");
        memory.createdAt = (new Date()).format("yyyy-MM-dd hh:mm:ss");

        memory.downloadCount = 6000;
        memory.installedCount = "6000";
        memory.tag = req.param("tag", false);
        memory.bytes = req.param("bytes", false);
        memory.appType = req.param("appType", false);
        memory.likesRate = "0";

        appDetails.update({id:app.id}).set(app).meta({fetch: true}).exec(function (err,record) {

            if(err) return res.negotiate(err);
            appHistory.createLog(memory, function(err, val){
              if(err) return res.negotiate(err);
              if(val){              
                  res.json({
                      code:200,
                      msg:"保存成功！",
                      result:record
                  });
              }else{
                  res.json({
                      code:400,
                      msg:"操作失败！"
                  });
              }
            });  
        });
    },
    /**
     * 后台应用新建接口
     * @param req
     * @param res
     * @param appdetails parameters
     */
    appDetailsCreate:function(req,res){
        //console.log('appDetailsCreate: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }
        
        var app = {};
        var memory = {};

        app.packageName = memory.packageName = req.param("packageName", false);
        app.title = memory.title = req.param("title", false);
        app.appType = memory.appType = req.param("appType", false);
        app.icons = req.param("icons", false);
        memory.icons = JSON.stringify(req.param("icons", false) ||"{}");
        app.versionName = memory.versionName = req.param("versionName", false);
        app.versionCode = memory.versionCode = parseInt(req.param("versionCode", 0));
        app.downloadUrl = memory.downloadUrl = req.param("downloadUrl", false);
        app.md5 = memory.md5 = req.param("md5", false);
        app.categories = memory.categories = req.param("categories", false);
        app.tag = memory.tag = req.param("tag", false);
        app.bytes = memory.bytes = req.param("bytes", false);
        app.downloadCount = memory.downloadCount = 6000;
        app.installedCount = memory.installedCount = "6000";
        app.likesRate = memory.likesRate = "0";
        app.tagline = memory.tagline = req.param("tagline", false);
        app.developer = memory.developer = req.param("developer", false);
        app.permissions = memory.permissions = req.param("permissions", false);
        app.screenshots = req.param("screenshots", false);
        memory.screenshots = JSON.stringify(req.param("screenshots", false) || "{}");
        app.changelog = memory.changelog = req.param("changelog", false);
        app.description = memory.description = req.param("description", false);
        app.class1 = memory.class1 = req.param("class1", false);
        app.class2 = memory.class2 = req.param("class2", false);
        app.unshelve = "0";
        app.unshelveTime = "0";
        app.setTop = "2";
        app.setTopTime = new Date().getTime();
        app.orderId = 0;
        app.updatedAt = memory.updatedAt = (new Date()).format("yyyy-MM-dd hh:mm:ss");
        app.createdAt = memory.createdAt = (new Date()).format("yyyy-MM-dd hh:mm:ss");

        appDetails.create(app).meta({fetch: true}).exec(function (err,record) { 
            if(err) return res.negotiate(err);
            memory.appId = record.id;
            console.log('record. check it out.', memory);
            // appHistory.create(memory).exec(function (err) {
            //   //grabAll.createOrder();
            //   if(err) return res.negotiate(err);
            //   if(record){              
            //       res.json({
            //           code:200,
            //           msg:"应用添加成功！",
            //           result:record
            //       });
            //   }else{
            //       res.json({
            //           code:400,
            //           msg:"操作失败！"
            //       });
            //   }
            // });
            appHistory.createLog(memory, function(err, val){
              if(err) return res.negotiate(err);
              if(val){              
                res.json({
                    code:200,
                    msg:"应用添加成功！",
                });
              }else{
                  res.json({
                      code:400,
                      msg:"操作失败！"
                  });
              }
            });
        });  
    },
    /**
     * 应用下载量增加接口
     * @param req
     * @param res
     * @param packageName
     */
    downloadCount:function(req,res){
      console.log('downloadCount: This is the function entry. check it out: ', req.allParams());

      var packageName = req.param("packageName", false);
      var queryStr = 'UPDATE appdetails SET downloadCount = downloadCount + 10 WHERE packageName = "'+ packageName +'"';
      appDetails.getDatastore().sendNativeQuery(queryStr, function(err, data){
          if (err) return res.negotiate(err);
          //console.log(data.rows.length);
          return res.json({
              code: 200,
              msg: "下载量增加成功！",
              //result: data.rows
          });                          
      }); 
    }, 
};