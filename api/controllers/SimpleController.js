var _ll = require('../services/lodash/fp')
var _l = require('../services/lodash')
module.exports = {

    test:function(req,res){
    // var filePath = req.param('filepath');
    // common.getAppMsg(filePath,function(err,appdata){
    //   if(err){
    //     console.log(err);
    //     return res.json({code:500});
    //   }
    //   console.log(appdata);
    //   return res.json({code:200,data:appdata});
    // });
    var cpcUrl = 'http://api.wandoujia.com/v1/adsCpc';
    var cpsParams = {
      "adstype":'app',
      "alias":'personalization',
      "ip":'172.16.1.150',
      "phone_imei":'869515027741260',
      "mac_address":'00:12:56:5c:14:c6',
      "phone_model":'Protrulv10',
      "api_level":'23',
      "startNum":10,
      "count":10
    };

    var adsAppUrl = 'http://api.wandoujia.com/v1/adsApp';
    var adsAppParams = {
      "packageNames":'',//应用包名列表，逗号分隔必填参数
      "ip":'172.16.1.150',//手机 ip 必填参数
      "phone_imei":'869515027741260',//
      "mac_address":'00:12:56:5c:14:c6',
      "phone_model":'Protrulv10',
      "api_level":'23',
      /**
       应用展示/下载位置 必填参数拼写规则：pos=open/id/位置类型
       id 即是分配给合作伙伴的
       id位置类型：由豌豆荚定义的四种位置类型。
       replace：用豌豆荚的广告包替换合作方原有的包#如果是替包的方式，请务必填写此字段#。
       list：用户有明确预期这个页面为应用分发页面。
       unexpect：用户无预期此页面为应用分发页面。
       precise：有目的性的广告，例如分类。
       */
      "pos":'open/baoqianli/precise'
    };

    var cpsParamsStr = '',adsParamsStr = '';
    var i = 0;
    for(var keys in cpsParams) {
      cpsParamsStr += i ? '&' : '';
      cpsParamsStr += keys + "=";
      cpsParamsStr += cpsParams[keys];
      i = 1;
    };


    //cps列表获取
    common.httpServer('api.wandoujia.com','/v1/adsCpc',null,'get',cpsParamsStr,null,function(err,cpss){
      if (err){
        console.log(err);
        return;
      }

      if(!cpss.length){
        return res.json({
          code:200,
          cpsdata:cpss,
          adsappdata:[]
        });
      }

      //对应cps的应用信息
      var arr = [];
      for(var k=0;k<cpss.length;k++){
        arr.push(cpss[k]['packageName']);
      }
      adsAppParams.packageNames = arr.join(',');
      var j = 0;
      for(var keys in adsAppParams) {
        adsParamsStr += j ? '&' : '';
        adsParamsStr += keys + "=";
        adsParamsStr += adsAppParams[keys] ;
        j = 1;
      };
      console.log(adsParamsStr);
      common.httpServer('api.wandoujia.com','/v1/adsApp',null,'get',adsParamsStr,null,function(err,adsapps){
        if (err){
          console.log(err);
          return;
        }
        return res.json({
          code:200,
          cpsdata:cpss,
          adsappdata:adsapps
        });
      });
    });
  },
    appDetailsCreate:function(req,res){

        console.log('appDetailsEditSave: This is the function entry. check it out: ', req.allParams());
        // if (!req.session.mine) {
        //       return res.json({
        //           code: 403,
        //           msg: "用户未登录"
        //       });
        // }

        //临时变量
        var app = app || {};
        var memory = memory || {};
        var allParams = req.allParams();

        //克隆参数
        //app = memory = allParams;
        app = _.clone(allParams);
        memory = _.clone(allParams);

        //续补变量
        memory.tag = false;
        memory.bytes = false;
        memory.likesRate = 0;
        memory.appType = false;
        memory.downloadCount = 10000;
        memory.installedCount = 10000;
        memory.createdAt = m.format2();

        //续补变量
        app.setTop = 2;
        app.orderId = 0;
        app.unshelve = 0;
        app.unshelveTime = 0;
        app.updatedAt = m.format2();
        app.createdAt = app.updatedAt;
        app.setTopTime = m.timestamp();

        console.log('app. check it out. ',app);
        appDetails.create(app).meta({fetch: true}).exec(function (err,record) {
             if(err) return res.negotiate(err);
             memory.appId = record.id;
             console.log('record. check it out. ',record);

             appHistory.createLog(memory, function(err, val){
                if(err) return res.negotiate(err);
                console.log('val:',val);
             });
        })

        res.json({
          code:200,
          msg:"保存成功！",
          result:[]
        });

        // app.id = memory.appId = req.param("id", false);
        // app.packageName = memory.packageName = req.param("packageName", false);
        // app.versionCode = memory.versionCode = req.param("versionCode", false);
        // app.title = memory.title = req.param("title", false);
        // app.icons = memory.icons = req.param("icons", false);
        // app.versionName = memory.versionName = req.param("versionName", false);
        // app.downloadUrl = memory.downloadUrl = req.param("downloadUrl", false);
        // app.md5 = memory.md5 = req.param("md5", false);
        // app.categories = memory.categories = req.param("categories", false);
        // app.class1 = memory.class1 = req.param("class1", false);
        // app.class2 = memory.class2 = req.param("class2", false);
        // app.tagline = memory.tagline = req.param("tagline", false);
        // app.developer = memory.developer = req.param("developer", false);
        // app.permissions = memory.permissions = req.param("permissions", false);
        // app.screenshots = memory.screenshots = req.param("screenshots", false);
        // app.changelog = memory.changelog = req.param("changelog", false);
        // app.description = memory.description = req.param("description", false);
        // app.updatedAt = memory.updatedAt = (new Date()).format("yyyy-MM-dd hh:mm:ss");
        // memory.createdAt = (new Date()).format("yyyy-MM-dd hh:mm:ss");

        // memory.downloadCount = 10000;
        // memory.installedCount = "10000";
        // memory.tag = req.param("tag", false);
        // memory.bytes = req.param("bytes", false);
        // memory.appType = req.param("appType", false);
        // memory.likesRate = "0";

        // appDetails.update({id:app.id}).set(app).meta({fetch: true}).exec(function (err,record) {

        //     if(err) return res.negotiate(err);
        //     appHistory.create(memory).exec(function (err) {
        //       if(err) return res.negotiate(err);
        //       if(record){
        //           res.json({
        //               code:200,
        //               msg:"保存成功！",
        //               result:record
        //           });
        //       }else{
        //           res.json({
        //               code:400,
        //               msg:"操作失败！"
        //           });
        //       }
        //     });
        // });

    },

hptest:function(req,res){
        console.log('hptest',req.allParams());
        var sqlQuerlClassify = "",list = [];
        sqlQuerlClassify += "select * from classify_658 LIMIT 2"

        sails.getDatastore('peas').sendNativeQuery(sqlQuerlClassify, function(err, r){
            if (err) return;

            list = r.rows;
            console.log('hptest r:  ',r);
            weeklyRanking.create(list[0]).exec(function (err) {
                    if (!err) return;
                    console.log(err,'\n\n\n');
                });
            return res.json({
                data:list,
                code: 200
            });
        });
},
hptest22:function(req,res){
var item={
            "id": 88,
            "ad": "0",
            "apks": "[{\"md5\": \"434fb020447aba492b97913c64b59270\", \"bytes\": 6238937, \"adsType\": \"NONE\", \"creation\": 1472120307000, \"language\": [], \"official\": 0, \"paidType\": \"NONE\", \"superior\": 0, \"verified\": 2, \"signature\": \"47842e4a3a95410ac65ad5f4be341f61\", \"downloadUrl\": {\"url\": \"http://apps.wandoujia.com/redirect?signature=680c3f4&url=http%3A%2F%2Fapk.wandoujia.com%2F0%2F27%2F434fb020447aba492b97913c64b59270.apk&pn=com.lenovo.leos.cloud.sync&md5=434fb020447aba492b97913c64b59270&apkid=19333844&vc=3950100&size=6238937&tokenId=baoqianli&pos=t%2Fapps%2Fcategories%2F%E5%AD%98%E5%82%A8%C2%B7%E4%BA%91%E7%9B%98%2Fweekly\", \"market\": \"当乐网\"}, \"permissions\": [\"查找设备上的帐户\", \"访问通话记录\", \"查看 Wi-Fi 状态\", \"控制振动器\", \"拨打电话\", \"读取主屏幕设置和快捷方式\", \"安装快捷方式\", \"监听新安装应用\", \"编辑或写入联系人\", \"写入同步设置\", \"访问联系人数据\", \"添加或修改日历活动以及向邀请对象发送电子邮件\", \"修改或删除USB存储设备中的内容\", \"读取手机状态和身份\", \"接收短信\", \"更改网络连接\", \"访问日历\", \"发送短信（此操作可能需要付费）\", \"重新设置外拨电话的路径\", \"创建帐户并设置密码\", \"接收彩信\", \"修改全局系统设置\", \"更改 Wi-Fi 状态\", \"防止手机休眠\", \"编辑短信或彩信\", \"显示系统级警报\", \"读取USB存储设备（例如：SD卡）中的内容\", \"停用键盘锁\", \"从互联网接收数据\", \"读取同步统计信息\", \"添加或移除帐户\", \"读取短信或彩信\", \"读取同步设置\", \"写入通话记录\", \"装载和卸载文件系统\", \"检索当前运行的应用程序\", \"开机启动\", \"卸载快捷方式\", \"读取基于网络的粗略位置\", \"查看网络状态\", \"接收短信（ WAP）\"], \"versionCode\": 3950100, \"versionName\": \"4.5.2\", \"maxSdkVersion\": 0, \"minSdkVersion\": 14, \"securityStatus\": \"UNKNOWN\", \"pubKeySignature\": \"5abdf9b649c2b8ac6026b88313c3c332\", \"targetSdkVersion\": 23}]",
            "appType": "APP",
            "categories": "[{\"name\": \"系统工具\", \"type\": \"APP\", \"alias\": \"optimization\", \"level\": 1}, {\"name\": \"存储·云盘\", \"type\": \"APP\", \"alias\": null, \"level\": 2}]",
            "changelog": "1.云服务适配于Android 6.0新的权限管理。 2.优化了进度列表。 3.修复相片BUG。",
            "description": "应用简介<br />云服务（原乐同步）是一款极其安全、完全免费的支持个人重要数据备份与同步的服务软件。该软件通过WIFI或数据连接将手机中的资料如通讯录、短信、通话记录、图片、应用等备份至云端，注册账号并登陆后即可随时随地查看和管理相关信息。<br />功能丰富全面 界面简单清新<br />最新的版本已支持应用数据和图片备份功能，通讯录、短信、通话记录、应用的备份也一并支持。<br />三大独有技术 安全极速备份<br />智能“增量同步”技术，解决备份短信等消耗大量的流量与漫长等待的烦恼；独有“数据压缩”技术，比同类产品至少节省70%流量；数字证书加密通道传输信息，让信息绝对安全不泄露。备份完成后软件自带的流量统计功能让用户对流量了如指掌。<br />贴心实用设计 随时随地同步<br />联系人去重功能，帮助你清理通讯录中重复的联系人和号码。查看云数据，随时随地在浏览器中查看已经备份的信息。查看操作记录，不再担心误操作让信息丢失。",
            "developer": "{\"id\": 47444931, \"name\": \"联想集团\", \"urls\": \"\", \"email\": \"\", \"intro\": \"\", \"weibo\": \"\", \"website\": \"\", \"verified\": 0}",
            "downloadCount": "418521",
            "downloadCountStr": "42 万",
            "downloadFinishUrl": "0",
            "downloadStartUrl": "0",
            "icons": "{\"px24\": \"http://img.wdjimg.com/mms/icon/v1/4/19/3ae5862c3064c1418a1b14293ffb6194_24_24.png\", \"px36\": \"http://img.wdjimg.com/mms/icon/v1/4/19/3ae5862c3064c1418a1b14293ffb6194_36_36.png\", \"px48\": \"http://img.wdjimg.com/mms/icon/v1/4/19/3ae5862c3064c1418a1b14293ffb6194_48_48.png\", \"px68\": \"http://img.wdjimg.com/mms/icon/v1/4/19/3ae5862c3064c1418a1b14293ffb6194_68_68.png\", \"px78\": \"http://img.wdjimg.com/mms/icon/v1/4/19/3ae5862c3064c1418a1b14293ffb6194_78_78.png\", \"px100\": \"http://img.wdjimg.com/mms/icon/v1/4/19/3ae5862c3064c1418a1b14293ffb6194_100_100.png\", \"px256\": \"http://img.wdjimg.com/mms/icon/v1/4/19/3ae5862c3064c1418a1b14293ffb6194_256_256.png\"}",
            "imprUrl": "",
            "installFinishUrl": "",
            "installedCount": "20841983",
            "installedCountStr": "2084 万",
            "itemStatus": "1",
            "likesRate": "75",
            "packageName": "com.lenovo.leos.cloud.sync",
            "publishDate": 1344604643000,
            "screenshots": "{\"small\": [\"http://img.wdjimg.com/mms/screenshot/d/91/f1081480cc4d889deee6cef7c870b91d_320_535.jpeg\", \"http://img.wdjimg.com/mms/screenshot/e/2e/926b1884b70078c04ace88e2213222ee_320_535.jpeg\", \"http://img.wdjimg.com/mms/screenshot/2/12/c94a5690e02e3026fa6f1f7eed1c3122_320_535.jpeg\", \"http://img.wdjimg.com/mms/screenshot/7/e6/0c9081a97983d260252cc6e911683e67_320_535.jpeg\", \"http://img.wdjimg.com/mms/screenshot/2/45/ed9c3213439098a251ee1a2e96b4b452_320_535.jpeg\"], \"normal\": [\"http://img.wdjimg.com/mms/screenshot/d/91/f1081480cc4d889deee6cef7c870b91d.jpeg\", \"http://img.wdjimg.com/mms/screenshot/e/2e/926b1884b70078c04ace88e2213222ee.jpeg\", \"http://img.wdjimg.com/mms/screenshot/2/12/c94a5690e02e3026fa6f1f7eed1c3122.jpeg\", \"http://img.wdjimg.com/mms/screenshot/7/e6/0c9081a97983d260252cc6e911683e67.jpeg\", \"http://img.wdjimg.com/mms/screenshot/2/45/ed9c3213439098a251ee1a2e96b4b452.jpeg\"]}",
            "stat": "{\"weeklyStr\": \"1万\"}",
            "tagline": "备份同步您的手机资料",
            "tags": "[{\"tag\": \"备份\", \"weight\": 5}, {\"tag\": \"存储\", \"weight\": 1}, {\"tag\": \"SD卡备份\", \"weight\": 1}, {\"tag\": \"照片同步\", \"weight\": 1}, {\"tag\": \"云盘\", \"weight\": 1}, {\"tag\": \"通讯录同步\", \"weight\": 1}, {\"tag\": \"同步\", \"weight\": 5}]",
            "title": "云服务（原乐同步）",
            "trusted": 1,
            "updatedDate": "1436150550000",
            "updatedAt": "1500963544344",
            "createdAt": "1500963544344"
        };
        weeklyRanking.create(item).exec(function (err) {
                    if (!err) return;
                        console.log(err,'\n\n\n');
            return res.json({
                data:'ok',
                code: 200
            });
        });
},

    upgrade:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        var dataObj = req.param('data');
        var sdkVersion = req.param('sdkVersion');
        var phone_imei = req.param('imei');


        var sysApps = dataObj['sysApps'],userApps = dataObj['userApps'];
        var initLen = userApps.length;
        var data = {model:dataObj['model'],sdkVersion:dataObj['sdkVersion'],resolution:dataObj['resolution'],sysApps:[],userApps:[]};
        var arr = [];
        async.series({
            bao:function(callback) {
                var j = 0;
                try{
                    if(userApps.length<1){
                        callback(null,[]);
                    }
                    userApps.forEach(function(item,index){
                        appDetails.find({
                            packageName:item.packageName,
                            md5:item.cerStrMd5,
                        }).exec(function(err,result){
                            if(result.length>0){
                                j++;
                                //参数传入的versionName的值
                                var vArr1 = item.versionName.split(".");
                                //后台返回的versionName的值
                                var vArr2 = result[0].versionName.split(".");
                                var length1 = vArr1.length,length2 = vArr2.length;
                                var versionFlag = 0;
                                console.log(length1,length2)
                                if (length1>length2){
                                    for(var i=0;i<length2;i++){
                                        if(vArr1[i]<vArr2[i]){
                                            versionFlag = 1;
                                            break;
                                        }
                                    }
                                }else if(length1=length2){
                                    for(var i=0;i<length2;i++){
                                        if(vArr1[i]<vArr2[i]){
                                            versionFlag = 1;
                                            break;
                                        }
                                    }
                                }else if(length1<length2){
                                    for(var i=0;i<length1;i++){
                                        if(vArr1[i]<vArr2[i]){
                                            versionFlag = 1;
                                            break;
                                        }
                                    }
                                    if(versionFlag != 1){
                                        versionFlag = 1;
                                    }
                                }
                                if(versionFlag == 1){
                                    userApps.remove(userApps[index]);
                                    var a = appDetails.updateFormat(result[0]);
                                    arr.push(a);
                                    if(initLen == j){
                                        console.log(j,initLen);
                                        data.userApps = userApps;
                                        callback(null,arr);
                                    }
                                }
                            }else{
                                j++;
                                if(initLen == j){
                                    console.log(j,initLen);
                                    data.userApps = userApps;
                                    callback(null,arr);
                                }
                            }
                        });
                    });
                }catch(e){
                    callback(e,[]);
                }
            },
            pea:function(callback){
                var params = 'data='+JSON.stringify(data).replace(/(^"*)|("$)/g,"").replace(/"/g,'%22')+'&sdkVersion='+parseInt(sdkVersion)+'&phone_imei='+phone_imei;
                common.httpServer('api.wandoujia.com','/v1/update',null,'post',params,dataObj,function(err,data){
                    callback(err,data);
                });
            }
        },function(err,results){
            if (err){
                console.log(err);
                return;
            }

            var finalArr = results['bao'].concat(results['pea']['userApps']);
            results.pea.userApps = finalArr;
            return res.json({code:200,data:results.pea,msg:'更新数据'});
        });
    },

    updateWeeklyRanking: function(req, res) {

        console.log('updateWeeklyRanking: This is the function entry. check it out: ',req.allParams());

        var sqlQuerlClassify = "",list = [];
        var classifyArray = dt.getAppsClassify();

        for(var i = 0; i<classifyArray.length; i++) {
            var ele = classifyArray[i];

            if (!i) {
                sqlQuerlClassify += "(select * from classify_" + ele.id +" LIMIT 2)"
            }else{
                sqlQuerlClassify += " UNION ";
                sqlQuerlClassify += "(select * from classify_" + ele.id +" LIMIT 2)"
            }
        }

        async.auto({
            queryClassfiy: function (callback) {
                try {

                    console.log('sqlQuerlClassify. check it out. ',sqlQuerlClassify);
                    sails.getDatastore('peas').sendNativeQuery(sqlQuerlClassify, function(err, r){
                        if (err) return;

                        list = r.rows;
                        list = m.changeData(list);
                        console.log('cb_tag1: The result of this query is shown came out. check it out:  ',r.rows.length);

                        list = m.packageNameUnique(list);
                        console.log('uniqWith. ',list.length);

                        list = _l.sortBy(list,'downloadCount');
                        console.log('sortBy..... ',list.length);

                        callback(err,list);
                    });

                }catch (e) {
                    console.log('queryClassfiy err: ', e);
                }
            },
            truncate: ['queryClassfiy', function (result,callback) {
                try {

                    var sqlTruncateClassify = 'truncate weeklyranking';
                    console.log('sqlTruncateClassify. check it out. ',sqlTruncateClassify);
                    weeklyRanking.getDatastore().sendNativeQuery(sqlTruncateClassify, function(err, r) {
                        console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                        callback(null,null);
                    });

                }catch (e) {
                    console.log('truncate err: ', e);
                }
            }],

        }, function (err, results) {

            var i = 0;
            while(list.length) {
                var item = list.pop();
                var date = m.timestamp();
                item.updatedAt = date;
                item.createdAt = date;
                item.ad = item.ad ? 1 : 0;

                var itemMap = new Map(Object.entries(item));
                var insertSql = m.insertSql(itemMap,'weeklyranking');
                weeklyRanking.getDatastore().sendNativeQuery(insertSql, function(err, r) {
                    if (!err) return;
                    console.log(err,'\n\n\n');
                });
            }

        });

        return res.json({
            data: [],
            code: 200,
            msg: "update weeklyranking finish"
        });
    },

    updateTotalRanking: function(req, res) {
        console.log('updateTotalRanking: This is the function entry. check it out: ',req.allParams());

        var sqlQuerlClassify = "";
        var classifyArray = dt.getAppsClassify();

        for(var i = 0; i<classifyArray.length; i++) {
            var ele = classifyArray[i];

            if (!i) {
                sqlQuerlClassify += "(select * from classify_" + ele.id +" LIMIT 2)"
            }else{
                sqlQuerlClassify += " UNION ";
                sqlQuerlClassify += "(select * from classify_" + ele.id +" LIMIT 2)"
            }
        }

        console.log('sqlQuerlClassify. check it out. ',sqlQuerlClassify);
        sails.getDatastore('peas').sendNativeQuery(sqlQuerlClassify, function(err, r){
            if (err) return;

            var list = r.rows;
            console.log('cb_tag1: The result of this query is shown came out. check it out:  ',r.rows.length);

            list = m.packageNameUnique(list);
            console.log('uniqWith. ',list.length);

            list = _l.sortBy(list,'downloadCount');
            console.log('sortBy..... ',list.length);

            list = m.changeData(list);

            async.auto({
                truncate: function (callback) {

                    try {

                        var sqlTruncateClassify = 'truncate totalranking';
                        console.log('sqlTruncateClassify. check it out. ',sqlTruncateClassify);
                        totalRanking.getDatastore().sendNativeQuery(sqlTruncateClassify, function(err, r){
                            console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                            callback(null,null);
                        });

                    } catch (e) {
                        console.log('truncate err: ', e);
                    }
                },
            }, function (err, results) {

                var i = 0;
                while(list.length) {
                    var item = list.pop();
                    var date = m.timestamp();
                    item.updatedAt = date;
                    item.createdAt = date;
                    item.ad = item.ad ? 1 : 0;

                    var itemMap = new Map(Object.entries(item));
                    var insertSql = m.insertSql(itemMap,'weeklyranking');
                    totalRanking.getDatastore().sendNativeQuery(insertSql, function(err, r) {
                        if (!err) return;
                        console.log(err,'\n\n\n');
                    });

                    break;
                }
            });
        });

        return res.json({
            data: [],
            code: 200,
            msg: "update weeklyranking finish"
        });
    },

    /**
    * 豆子榜单视图
    *
    * 这个函数用于获取应用榜单列表，
    *
    * @return { 结果集 }
    */
    gotoAppsList2: function(req, res) {
        console.log('gotoAppsList2: This is the function entry. check it out: ', req.allParams());

        var allParams = req.allParams();

        var map = new Map();

        //控制器检查
        map.set('OPTION_CHECK',OPTION_CHECK);

        //访问检查
        var acces = ck.isAccess(req,res,map);
        if (acces !== 200) return acces;

        io.connect('api.wandoujia.com','/v1/apps','get',req,allParams,function (err,list) {
            if (err) {
                console.log('err onfocus: ',err);
                return;
            }

            console.log('cb_tag2: The result of this find is shown came out. check it out: ',list.length);
            return res.json({
                data: list,
                code: 200,
                msg: ""
            });
        });
    },

    onfocus2: function (req, res) {
        var allParams = req.allParams();
        console.log('onfocus2: This is the function entry. check it out: ',req.allParams());

        if (req.session) {
            console.log('get session. check it out. ',req.session.mine);
        }

        return res.json({
            data: req.session,
            code: 200,
            msg: ""
        });
    },

    gotoRefresh: function (req, res) {
        dt.refreshPeasInterface();
        return res.json({
            data: [],
            code: 200,
            msg: ""
        });
    },

    getClassify: function(req, res) {
        //console.log('暂未开放');
        //return;
        // var http = require('http');
        console.log('getClassify: This is the function entry. check it out: ',req.allParams());

        var allParams = {},subClassify,zIndex = 0;
        var idx = 0,isPop = [],counter = 0,list = [];

        var aHttp = true;
        var bHttp = false;
        var http = require('http');
        var classifyArray = dt.getAppsClassify();
        var interval = setInterval(function () {
                try {

                    allParams.phone_imei = "861374037347422";
                    subClassify = classifyArray[counter];
                    allParams.tag = escape(subClassify.name);
                    allParams.start = zIndex * 40;
                    allParams.type = "weekly";
                    allParams.max = 40;

                    if (!isPop[zIndex]) {

                        isPop[zIndex] = isPop[zIndex] || 1

                        if (aHttp&&!bHttp) {

                            io.con('api.wandoujia.com','/v1/apps','get',allParams,function (err,rows) {

                                if (err){
                                  console.log(err);
                                  return;
                                }

                                rows = rows || [];
                                rows[0] = rows[0] || {};
                                rows[0].apps = rows[0].apps || [];
                                console.log('counter...',counter);
                                console.log('zIndex.....',zIndex);
                                console.log('1st.Http.rows.',rows[0].apps.length);

                                if (!counter) {
                                    dt.setData(rows[0].apps.slice());
                                }

                                if (rows[0].apps.length&&zIndex<30) {

                                    list = list.concat(rows[0].apps);
                                    console.log('list. ',list.length);
                                    zIndex = zIndex + 1;
                                    isPop[zIndex]++;
                                }else{

                                    //切换网络
                                    if (!zIndex) {
                                        bHttp = true;
                                        aHttp = false;
                                        console.log('change http.2nd.');
                                    }else{
                                        counter = counter + 1;
                                        if (counter === classifyArray.length) {
                                            clearInterval(interval);
                                            console.log('1st.interval finsish.');
                                        }

                                        console.log('list.. ',list.length);

                                        list = _l.uniqWith(list, _l.isEqual);
                                        console.log('uniqWith. ',list.length);

                                        list = _l.sortBy(list,'downloadCount');
                                        console.log('sortBy..... ',list.length);

                                        var model = 'classify_' + subClassify.id;
                                        console.log('model. check it out. ',model);

                                        list = m.changeApps(list);

                                        async.auto({
                                            truncate: function (callback) {

                                                try {

                                                    if (_l.isEqual('classify_237',model)) {

                                                        var sqlTruncateClassify = 'truncate ' + model;
                                                        console.log('sqlTruncateClassify. check it out. ',sqlTruncateClassify);
                                                        eval(model).getDatastore().sendNativeQuery(sqlTruncateClassify, function(err, r){
                                                            console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                            callback(null,null);
                                                        });

                                                    }else{
                                                        callback(null,null);
                                                    }


                                                } catch (e) {
                                                    console.log('truncate err: ', e);
                                                }
                                            },
                                        }, function (err, results) {

                                            if (_l.isEqual('classify_237',model)) {
                                                var i = 0;
                                                while(list.length) {
                                                    var item = list.pop();
                                                    var date = m.timestamp();
                                                    item.updatedAt = date;
                                                    item.createdAt = date;
                                                    item.ad = item.ad ? 1 : 0;
                                                    eval(model).create(item).exec(function (err) {
                                                        if (!err) return;
                                                        console.log(err,'\n\n\n');
                                                    });
                                                }
                                            }

                                            //test
                                            list = [];
                                            //test

                                            isPop = [];
                                            zIndex = 0;
                                        });
                                    }
                                }
                            });
                        }

                        if (!aHttp&&bHttp) {

                            var reqUrl = "http://";
                            var objToken = io.getToken();

                            reqUrl += "api.wandoujia.com/v1/apps";

                            reqUrl += "?";

                            reqUrl += "start=" + zIndex*40;

                            reqUrl += "&";
                            reqUrl += "tag=" + allParams.tag;

                            reqUrl += "&";
                            reqUrl += "max=" + 40;

                            reqUrl += "&";
                            reqUrl += "phone_imei=" + "861374037347422";

                            reqUrl += "&";
                            reqUrl += "type=weekly";

                            reqUrl += "&";
                            reqUrl += "id=baoqianli";

                            reqUrl += "&";
                            reqUrl += "token=" + objToken.apitoken;

                            reqUrl += "&";
                            reqUrl += "timestamp=" + objToken.timestamp;

                            console.log('reqUrl. check it out. ',reqUrl);
                            http.get(reqUrl, function(respone) {

                                var resData = "";
                                respone.on("data",function(data){
                                    resData += data;
                                });
                                respone.on("end", function() {

                                    var rows = JSON.parse(resData);

                                    rows = rows || [];
                                    rows[0] = rows[0] || {};
                                    rows[0].apps = rows[0].apps || [];
                                    console.log('counter...',counter);
                                    console.log('zIndex.....',zIndex);
                                    console.log('2nd.Http.rows.',rows[0].apps.length);

                                    if (rows[0].apps.length&&zIndex<30) {

                                        list = list.concat(rows[0].apps);
                                        console.log('list. ',list.length);
                                        zIndex = zIndex + 1;
                                        isPop[zIndex]++;
                                    }else{

                                        //切换网络
                                        if (!zIndex) {
                                            aHttp = true;
                                            bHttp = false;
                                            isPop[zIndex] = null;
                                            console.log('change http.1st.');
                                        }else{
                                            counter = counter + 1;
                                            if (counter === classifyArray.length) {
                                                clearInterval(interval);
                                                console.log('2nd.interval finsish.');
                                            }

                                            console.log('list.. ',list.length);

                                            list = _l.uniqWith(list, _l.isEqual);
                                            console.log('uniqWith. ',list.length);

                                            list = _l.sortBy(list,'downloadCount');
                                            console.log('sortBy..... ',list.length);

                                            var model = 'classify_' + subClassify.id;
                                            console.log('model. check it out. ',model);

                                            list = m.changeApps(list);

                                            async.auto({
                                                truncate: function (callback) {

                                                    try {

                                                        if (_l.isEqual('classify_237',model)) {

                                                            var sqlTruncateClassify = 'truncate ' + model;
                                                            console.log('sqlTruncateClassify. check it out. ',sqlTruncateClassify);
                                                            eval(model).getDatastore().sendNativeQuery(sqlTruncateClassify, function(err, r){
                                                                if (err) return;
                                                                console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                                callback(null,null);
                                                            });

                                                        }else{
                                                            callback(null,null);
                                                        }


                                                    } catch (e) {
                                                        console.log('truncate err: ', e);
                                                    }
                                                },
                                            }, function (err, results) {

                                                if (_l.isEqual('classify_237',model)) {

                                                    var i = 0;
                                                    while(list.length) {
                                                        var item = list.pop();
                                                        var date = m.timestamp();
                                                        item.updatedAt = date;
                                                        item.createdAt = date;
                                                        item.ad = item.ad ? 1 : 0;
                                                        eval(model).create(item).exec(function (err) {
                                                            if (!err) return;
                                                            console.log(err,'\n\n\n');
                                                        });
                                                    }

                                                }


                                                //test
                                                list = [];
                                                //test

                                                isPop = [];
                                                zIndex = 0;
                                            });
                                        }
                                    }
                                });
                            });
                        }

                    }else{

                        if (isPop[zIndex]>200) {
                            list = [];
                            isPop = [];
                            zIndex = 0;
                            aHttp = true;
                            bHttp = false;
                            console.log('the request reset.');
                        }else{
                            isPop[zIndex]++;
                            console.log('wait. check it out. ',isPop[zIndex]);
                        }
                    }
                }catch(e) {
                  console.log(e);
                }
         },50);//1000/50=20

        return res.json({
            data: [],
            code: 200,
            msg: "get peas data..."
        });
    },

    getNewClassify: function(req, res) {
        //console.log('暂未开放');
        //return;
        // var http = require('http');
        console.log('getNewClassify: This is the function entry. check it out: ',req.allParams());

        var allParams = {},subClassify,zIndex = 0;
        var idx = 0,isPop = [],counter = 0,list = [];

        var ads = {"travel": "旅游出行","finance":"金融理财","video": "视频","shopping": "购物",
        "music": "音乐","picture": "图像","news": "新闻阅读","tools": "生活实用工具","optimization": "系统工具",
        "personalization": "美化手机","business": "效率办公","communication": "聊天社交","mobile": "电话通讯",
        "traffic": "交通导航","lifestyle": "生活服务","healthy": "运动健康","education": "教育培训",
        "female": "丽人母婴","casual": "休闲时间","parkour": "跑酷竞速","popping": "宝石消除",
        "ol": "网络游戏","shooting": "动作射击","poker": "扑克棋牌","puz": "儿童益智","defence": "塔防守卫",
        "sports": "体育格斗","rpg": "角色扮演","strategy": "经营策略"};
        //adstype=all&ip=127.0.0.1&mac_address=9C:F4:8E:31:BB:0E&phone_model=android&api_level=1&startNum=1&count=20&alias=旅游出行

        var aHttp = true;
        var bHttp = false;
        var http = require('http');
        var classifyArray = dt.getAppsClassify();
        var interval = setInterval(function () {
                try {

                    subClassify = classifyArray[counter];
                    allParams.count = 20;
                    allParams.startNum = zIndex * 20;
                    allParams.api_level = 1;
                    allParams.adstype = "all";
                    allParams.ip = "127.0.0.1";
                    allParams.travel = subClassify.name;
                    allParams.api_level = "android";
                    allParams.phone_imei = "861374037347422";
                    allParams.mac_address = "9C:F4:8E:31:BB:0E";

                    // allParams.tag = subClassify.name;
                    // allParams.start = zIndex * 40;
                    // allParams.type = "weekly";
                    // allParams.max = 40;

                    if (!isPop[zIndex]) {

                        isPop[zIndex] = isPop[zIndex] || 1

                        if (aHttp&&!bHttp) {

                            io.con('api.wandoujia.com','/v1/adsApp','get',allParams,function (err,rows) {

                                if (err){
                                  console.log(err);
                                  return;
                                }

                                rows = rows || [];
                                rows[0] = rows[0] || {};
                                rows[0].apps = rows[0].apps || [];
                                console.log('counter...',counter);
                                console.log('zIndex.....',zIndex);
                                console.log('1st.Http.rows.',rows[0].apps.length);

                                if (!counter) {
                                    dt.setData(rows[0].apps.slice());
                                }

                                if (rows[0].apps.length&&zIndex<30) {

                                    list = list.concat(rows[0].apps);
                                    console.log('list. ',list.length);
                                    zIndex = zIndex + 1;
                                    isPop[zIndex]++;
                                }else{

                                    //切换网络
                                    if (!zIndex) {
                                        bHttp = true;
                                        aHttp = false;
                                        console.log('change http.2nd.');
                                    }else{
                                        counter = counter + 1;
                                        if (counter === classifyArray.length) {
                                            clearInterval(interval);
                                            console.log('1st.interval finsish.');
                                        }

                                        console.log('list.. ',list.length);

                                        list = _l.uniqWith(list, _l.isEqual);
                                        console.log('uniqWith. ',list.length);

                                        list = _l.sortBy(list,'downloadCount');
                                        console.log('sortBy..... ',list.length);

                                        var model = 'classify_' + subClassify.id;
                                        console.log('model. check it out. ',model);

                                        list = m.changeApps(list);

                                        async.auto({
                                            truncate: function (callback) {

                                                try {

                                                    if (_l.isEqual('classify_237',model)) {

                                                        var sqlTruncateClassify = 'truncate ' + model;
                                                        console.log('sqlTruncateClassify. check it out. ',sqlTruncateClassify);
                                                        eval(model).getDatastore().sendNativeQuery(sqlTruncateClassify, function(err, r){
                                                            console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                            callback(null,null);
                                                        });

                                                    }else{
                                                        callback(null,null);
                                                    }


                                                } catch (e) {
                                                    console.log('truncate err: ', e);
                                                }
                                            },
                                        }, function (err, results) {

                                            if (_l.isEqual('classify_237',model)) {
                                                var i = 0;
                                                while(list.length) {
                                                    var item = list.pop();
                                                    var date = m.timestamp();
                                                    item.updatedAt = date;
                                                    item.createdAt = date;
                                                    item.ad = item.ad ? 1 : 0;
                                                    eval(model).create(item).exec(function (err) {
                                                        if (!err) return;
                                                        console.log(err,'\n\n\n');
                                                    });
                                                }
                                            }

                                            //test
                                            list = [];
                                            //test

                                            isPop = [];
                                            zIndex = 0;
                                        });
                                    }
                                }
                            });
                        }

                        if (!aHttp&&bHttp) {

                            var reqUrl = "http://";
                            var objToken = io.getToken();

                            reqUrl += "api.wandoujia.com/v1/adsApp";

                            reqUrl += "?";

                            reqUrl += "startNum=" + zIndex*20;

                            reqUrl += "&";
                            reqUrl += "tag=" + allParams.tag;

                            reqUrl += "&";
                            reqUrl += "max=" + 40;

                            reqUrl += "&";
                            reqUrl += "phone_imei=" + "861374037347422";

                            reqUrl += "&";
                            reqUrl += "type=weekly";

                            reqUrl += "&";
                            reqUrl += "id=baoqianli";

                            reqUrl += "&";
                            reqUrl += "token=" + objToken.apitoken;

                            reqUrl += "&";
                            reqUrl += "timestamp=" + objToken.timestamp;

                            console.log('reqUrl. check it out. ',reqUrl);
                            http.get(reqUrl, function(respone) {

                                var resData = "";
                                respone.on("data",function(data){
                                    resData += data;
                                });
                                respone.on("end", function() {

                                    var rows = JSON.parse(resData);

                                    rows = rows || [];
                                    rows[0] = rows[0] || {};
                                    rows[0].apps = rows[0].apps || [];
                                    console.log('counter...',counter);
                                    console.log('zIndex.....',zIndex);
                                    console.log('2nd.Http.rows.',rows[0].apps.length);

                                    if (rows[0].apps.length&&zIndex<30) {

                                        list = list.concat(rows[0].apps);
                                        console.log('list. ',list.length);
                                        zIndex = zIndex + 1;
                                        isPop[zIndex]++;
                                    }else{

                                        //切换网络
                                        if (!zIndex) {
                                            aHttp = true;
                                            bHttp = false;
                                            isPop[zIndex] = null;
                                            console.log('change http.1st.');
                                        }else{
                                            counter = counter + 1;
                                            if (counter === classifyArray.length) {
                                                clearInterval(interval);
                                                console.log('2nd.interval finsish.');
                                            }

                                            console.log('list.. ',list.length);

                                            list = _l.uniqWith(list, _l.isEqual);
                                            console.log('uniqWith. ',list.length);

                                            list = _l.sortBy(list,'downloadCount');
                                            console.log('sortBy..... ',list.length);

                                            var model = 'classify_' + subClassify.id;
                                            console.log('model. check it out. ',model);

                                            list = m.changeApps(list);

                                            async.auto({
                                                truncate: function (callback) {

                                                    try {

                                                        if (_l.isEqual('classify_237',model)) {

                                                            var sqlTruncateClassify = 'truncate ' + model;
                                                            console.log('sqlTruncateClassify. check it out. ',sqlTruncateClassify);
                                                            eval(model).getDatastore().sendNativeQuery(sqlTruncateClassify, function(err, r){
                                                                if (err) return;
                                                                console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                                callback(null,null);
                                                            });

                                                        }else{
                                                            callback(null,null);
                                                        }


                                                    } catch (e) {
                                                        console.log('truncate err: ', e);
                                                    }
                                                },
                                            }, function (err, results) {

                                                if (_l.isEqual('classify_237',model)) {

                                                    var i = 0;
                                                    while(list.length) {
                                                        var item = list.pop();
                                                        var date = m.timestamp();
                                                        item.updatedAt = date;
                                                        item.createdAt = date;
                                                        item.ad = item.ad ? 1 : 0;
                                                        eval(model).create(item).exec(function (err) {
                                                            if (!err) return;
                                                            console.log(err,'\n\n\n');
                                                        });
                                                    }

                                                }


                                                //test
                                                list = [];
                                                //test

                                                isPop = [];
                                                zIndex = 0;
                                            });
                                        }
                                    }
                                });
                            });
                        }

                    }else{

                        if (isPop[zIndex]>200) {
                            list = [];
                            isPop = [];
                            zIndex = 0;
                            aHttp = true;
                            bHttp = false;
                            console.log('the request reset.');
                        }else{
                            isPop[zIndex]++;
                            console.log('wait. check it out. ',isPop[zIndex]);
                        }
                    }
                }catch(e) {
                  console.log(e);
                }
         },50);//1000/50=20

        return res.json({
            data: [],
            code: 200,
            msg: "get peas data..."
        });
    },

    getWeeklyRanking: function(req, res) {
        console.log('暂未开放');
        return;
        // var http = require('http');
        console.log('getClassify: This is the function entry. check it out: ',req.allParams());

        var allParams = {},subClassify,zIndex = 0;
        var idx = 0,isPop = [],counter = 0,list = [];

        var aHttp = true;
        var bHttp = false;
        var http = require('http');
        var classifyArray = dt.getAppsClassify();
        var interval = setInterval(function () {
                try {

                    allParams.phone_imei = "861374037347422";
                    allParams.tag = -1;
                    allParams.start = zIndex * 40;
                    allParams.type = "weekly";
                    allParams.verified = 0;
                    allParams.max = 40;

                    if (!isPop[zIndex]) {

                        isPop[zIndex] = isPop[zIndex] || 1

                        if (aHttp&&!bHttp) {

                            io.con('api.wandoujia.com','/v1/apps','get',allParams,function (err,rows) {

                                if (err){
                                  console.log(err);
                                  return;
                                }

                                rows = rows || [];
                                rows[0] = rows[0] || {};
                                rows[0].apps = rows[0].apps || [];
                                console.log('counter...',counter);
                                console.log('zIndex.....',zIndex);
                                console.log('1st.Http.rows.',rows[0].apps.length);

                                if (!counter) {
                                    dt.setData(rows[0].apps.slice());
                                }

                                if (rows[0].apps.length&&zIndex<30) {

                                    list = list.concat(rows[0].apps);
                                    console.log('list. ',list.length);
                                    zIndex = zIndex + 1;
                                    isPop[zIndex]++;
                                }else{

                                    //切换网络
                                    if (!zIndex) {
                                        bHttp = true;
                                        aHttp = false;
                                        console.log('change http.2nd.');
                                    }else{
                                        counter = counter + 1;
                                        clearInterval(interval);
                                        console.log('1st.interval finsish.');

                                        console.log('list.. ',list.length);

                                        list = _l.uniqWith(list, _l.isEqual);
                                        console.log('uniqWith. ',list.length);

                                        list = _l.sortBy(list,'downloadCount');
                                        console.log('sortBy..... ',list.length);

                                        // var model = 'classify_' + subClassify.id;
                                        // console.log('model. check it out. ',model);

                                        list = m.changeApps(list);

                                        async.auto({
                                            truncate: function (callback) {

                                                try {

                                                    var sqlTruncateWeeklyRanking = 'truncate weeklyranking';
                                                    console.log('sqlTruncateWeeklyRanking. check it out. ',sqlTruncateWeeklyRanking);
                                                    weeklyRanking.getDatastore().sendNativeQuery(sqlTruncateWeeklyRanking, function(err, r){
                                                        console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                        callback(null,null);
                                                    });

                                                } catch (e) {
                                                    console.log('truncate err: ', e);
                                                }
                                            },
                                        }, function (err, results) {

                                            var i = 0;
                                            while(list.length) {
                                                var item = list.pop();
                                                var date = m.timestamp();
                                                item.updatedAt = date;
                                                item.createdAt = date;
                                                item.ad = item.ad ? 1 : 0;
                                                weeklyRanking.create(item).exec(function (err) {
                                                    if (!err) return;
                                                    console.log(err,'\n\n\n');
                                                });
                                            }

                                            isPop = [];
                                            zIndex = 0;
                                        });
                                    }
                                }
                            });
                        }

                        if (!aHttp&&bHttp) {

                            var reqUrl = "http://";
                            var objToken = io.getToken();

                            reqUrl += "api.wandoujia.com/v1/apps";

                            reqUrl += "?";

                            reqUrl += "start=" + zIndex*40;

                            reqUrl += "&";
                            reqUrl += "tag=" + allParams.tag;

                            reqUrl += "&";
                            reqUrl += "max=" + 40;

                            reqUrl += "&";
                            reqUrl += "phone_imei=" + "861374037347422";

                            reqUrl += "&";
                            reqUrl += "type=weekly";

                            reqUrl += "&";
                            reqUrl += "id=baoqianli";

                            reqUrl += "&";
                            reqUrl += "token=" + objToken.apitoken;

                            reqUrl += "&";
                            reqUrl += "timestamp=" + objToken.timestamp;

                            console.log('reqUrl. check it out. ',reqUrl);
                            http.get(reqUrl, function(respone) {

                                var resData = "";
                                respone.on("data",function(data){
                                    resData += data;
                                });
                                respone.on("end", function() {

                                    var rows = JSON.parse(resData);

                                    rows = rows || [];
                                    rows[0] = rows[0] || {};
                                    rows[0].apps = rows[0].apps || [];
                                    console.log('counter...',counter);
                                    console.log('zIndex.....',zIndex);
                                    console.log('2nd.Http.rows.',rows[0].apps.length);

                                    if (rows[0].apps.length&&zIndex<30) {

                                        list = list.concat(rows[0].apps);
                                        console.log('list. ',list.length);
                                        zIndex = zIndex + 1;
                                        isPop[zIndex]++;
                                    }else{

                                        //切换网络
                                        if (!zIndex) {
                                            aHttp = true;
                                            bHttp = false;
                                            isPop[zIndex] = null;
                                            console.log('change http.1st.');
                                        }else{
                                            counter = counter + 1;
                                            clearInterval(interval);
                                            console.log('2nd.interval finsish.');

                                            console.log('list.. ',list.length);

                                            list = _l.uniqWith(list, _l.isEqual);
                                            console.log('uniqWith. ',list.length);

                                            list = _l.sortBy(list,'downloadCount');
                                            console.log('sortBy..... ',list.length);

                                            // var model = 'classify_' + subClassify.id;
                                            // console.log('model. check it out. ',model);

                                            list = m.changeApps(list);

                                            async.auto({
                                                truncate: function (callback) {

                                                    try {

                                                        var sqlTruncateWeeklyRanking = 'truncate weeklyranking';
                                                        console.log('sqlTruncateWeeklyRanking. check it out. ',sqlTruncateWeeklyRanking);
                                                        weeklyRanking.getDatastore().sendNativeQuery(sqlTruncateWeeklyRanking, function(err, r){
                                                            if (err) return;
                                                            console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                            callback(null,null);
                                                        });


                                                    } catch (e) {
                                                        console.log('truncate err: ', e);
                                                    }
                                                },
                                            }, function (err, results) {

                                                var i = 0;
                                                while(list.length) {
                                                    var item = list.pop();
                                                    var date = m.timestamp();
                                                    item.updatedAt = date;
                                                    item.createdAt = date;
                                                    item.ad = item.ad ? 1 : 0;
                                                    weeklyRanking.create(item).exec(function (err) {
                                                        if (!err) return;
                                                        console.log(err,'\n\n\n');
                                                    });
                                                }

                                                isPop = [];
                                                zIndex = 0;
                                            });
                                        }
                                    }
                                });
                            });
                        }

                    }else{

                        if (isPop[zIndex]>200) {
                            list = [];
                            isPop = [];
                            zIndex = 0;
                            aHttp = true;
                            bHttp = false;
                            console.log('the request reset.');
                        }else{
                            isPop[zIndex]++;
                            console.log('wait. check it out. ',isPop[zIndex]);
                        }
                    }
                }catch(e) {
                  console.log(e);
                }
         },50);//1000/50=20

        return res.json({
            data: [],
            code: 200,
            msg: "get peas weekly ranking data..."
        });
    },

    getTotalRanking: function(req, res) {
        console.log('getTotalRanking: This is the function entry. check it out: ',req.allParams());

        var allParams = {},subClassify,zIndex = 0;
        var idx = 0,isPop = [],counter = 0,list = [];

        var aHttp = true;
        var bHttp = false;
        var http = require('http');
        var classifyArray = dt.getAppsClassify();
        var interval = setInterval(function () {
                try {

                    allParams.phone_imei = "861374037347422";
                    allParams.start = zIndex * 40;
                    allParams.type = "total";
                    allParams.max = 40;
                    allParams.tag = -1;

                    if (!isPop[zIndex]) {

                        isPop[zIndex] = isPop[zIndex] || 1

                        if (aHttp&&!bHttp) {

                            io.con('api.wandoujia.com','/v1/apps','get',allParams,function (err,rows) {

                                if (err){
                                  console.log(err);
                                  return;
                                }

                                rows = rows || [];
                                rows[0] = rows[0] || {};
                                rows[0].apps = rows[0].apps || [];
                                console.log('counter...',counter);
                                console.log('zIndex.....',zIndex);
                                console.log('1st.Http.rows.',rows[0].apps.length);

                                if (rows[0].apps.length&&zIndex<30) {

                                    list = list.concat(rows[0].apps);
                                    console.log('list. ',list.length);
                                    zIndex = zIndex + 1;
                                    isPop[zIndex]++;
                                }else{

                                    //切换网络
                                    if (!zIndex) {
                                        bHttp = true;
                                        aHttp = false;
                                        console.log('change http.2nd.');
                                    }else{
                                        counter = counter + 1;
                                        clearInterval(interval);
                                        console.log('1st.interval finsish.');

                                        console.log('list.. ',list.length);

                                        list = _l.uniqWith(list, _l.isEqual);
                                        console.log('uniqWith. ',list.length);

                                        list = _l.sortBy(list,'downloadCount');
                                        console.log('sortBy..... ',list.length);

                                        //var model = 'week' + subClassify.id;
                                        //console.log('model. check it out. ',model);

                                        list = m.changeApps(list);

                                        async.auto({
                                            truncate: function (callback) {

                                                try {

                                                    var sqlTruncateTotalRanking = 'truncate totalranking';
                                                    console.log('sqlTruncateTotalRanking. check it out. ',sqlTruncateTotalRanking);
                                                    totalRanking.getDatastore().sendNativeQuery(sqlTruncateTotalRanking, function(err, r){
                                                        console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                        callback(null,null);
                                                    });

                                                } catch (e) {
                                                    console.log('truncate err: ', e);
                                                }
                                            },
                                        }, function (err, results) {

                                            var i = 0;
                                            while(list.length) {
                                                var item = list.pop();
                                                var date = m.timestamp();
                                                item.updatedAt = date;
                                                item.createdAt = date;
                                                item.ad = item.ad ? 1 : 0;
                                                totalRanking.create(item).exec(function (err) {
                                                    if (!err) return;
                                                    console.log(err,'\n\n\n');
                                                });
                                            }

                                            isPop = [];
                                            zIndex = 0;
                                        });
                                    }
                                }
                            });
                        }

                        if (!aHttp&&bHttp) {

                            var reqUrl = "http://";
                            var objToken = io.getToken();

                            reqUrl += "api.wandoujia.com/v1/apps";

                            reqUrl += "?";

                            reqUrl += "start=" + zIndex*40;

                            reqUrl += "&";
                            reqUrl += "tag=" + allParams.tag;

                            reqUrl += "&";
                            reqUrl += "max=" + 40;

                            reqUrl += "&";
                            reqUrl += "phone_imei=" + "861374037347422";

                            reqUrl += "&";
                            reqUrl += "type=weekly";

                            reqUrl += "&";
                            reqUrl += "id=baoqianli";

                            reqUrl += "&";
                            reqUrl += "token=" + objToken.apitoken;

                            reqUrl += "&";
                            reqUrl += "timestamp=" + objToken.timestamp;

                            console.log('reqUrl. check it out. ',reqUrl);
                            http.get(reqUrl, function(respone) {

                                var resData = "";
                                respone.on("data",function(data){
                                    resData += data;
                                });
                                respone.on("end", function() {

                                    var rows = JSON.parse(resData);

                                    rows = rows || [];
                                    rows[0] = rows[0] || {};
                                    rows[0].apps = rows[0].apps || [];
                                    console.log('counter...',counter);
                                    console.log('zIndex.....',zIndex);
                                    console.log('2nd.Http.rows.',rows[0].apps.length);

                                    if (rows[0].apps.length&&zIndex<30) {

                                        list = list.concat(rows[0].apps);
                                        console.log('list. ',list.length);
                                        zIndex = zIndex + 1;
                                        isPop[zIndex]++;
                                    }else{

                                        //切换网络
                                        if (!zIndex) {
                                            aHttp = true;
                                            bHttp = false;
                                            isPop[zIndex] = null;
                                            console.log('change http.1st.');
                                        }else{
                                            counter = counter + 1;
                                            clearInterval(interval);
                                            console.log('2nd.interval finsish.');

                                            console.log('list.. ',list.length);

                                            list = _l.uniqWith(list, _l.isEqual);
                                            console.log('uniqWith. ',list.length);

                                            list = _l.sortBy(list,'downloadCount');
                                            console.log('sortBy..... ',list.length);

                                            //var model = 'classify_' + subClassify.id;
                                            //console.log('model. check it out. ',model);

                                            list = m.changeApps(list);

                                            async.auto({
                                                truncate: function (callback) {

                                                    try {


                                                        var sqlTruncateTotalRanking = 'truncate totalranking';
                                                        console.log('sqlTruncateTotalRanking. check it out. ',sqlTruncateTotalRanking);
                                                        totalRanking.getDatastore().sendNativeQuery(sqlTruncateTotalRanking, function(err, r){
                                                            if (err) return;
                                                            console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                            callback(null,null);
                                                        });

                                                    } catch (e) {
                                                        console.log('truncate err: ', e);
                                                    }
                                                },
                                            }, function (err, results) {

                                                var i = 0;
                                                while(list.length) {
                                                    var item = list.pop();
                                                    var date = m.timestamp();
                                                    item.updatedAt = date;
                                                    item.createdAt = date;
                                                    item.ad = item.ad ? 1 : 0;
                                                    totalRanking.create(item).exec(function (err) {
                                                        if (!err) return;
                                                        console.log(err,'\n\n\n');
                                                    });
                                                }

                                                isPop = [];
                                                zIndex = 0;
                                            });
                                        }
                                    }
                                });
                            });
                        }

                    }else{

                        if (isPop[zIndex]>200) {
                            list = [];
                            isPop = [];
                            zIndex = 0;
                            aHttp = true;
                            bHttp = false;
                            console.log('the request reset.');
                        }else{
                            isPop[zIndex]++;
                            console.log('wait. check it out. ',isPop[zIndex]);
                        }
                    }
                }catch(e) {
                  console.log(e);
                }
         },50);//1000/50=20

        return res.json({
            data: [],
            code: 200,
            msg: "get peas total ranking data..."
        });
    },

    getLatestRanking: function(req, res) {
        console.log('getLatestRanking: This is the function entry. check it out: ',req.allParams());

        var allParams = {},subClassify,zIndex = 0;
        var idx = 0,isPop = [],counter = 0,list = [];

        var aHttp = true;
        var bHttp = false;
        var http = require('http');
        var classifyArray = dt.getAppsClassify();
        var interval = setInterval(function () {
                try {

                    allParams.phone_imei = "861374037347422";
                    allParams.start = zIndex * 40;
                    allParams.type = "latest";
                    allParams.max = 40;
                    allParams.tag = -1;

                    if (!isPop[zIndex]) {

                        isPop[zIndex] = isPop[zIndex] || 1

                        if (aHttp&&!bHttp) {

                            io.con('api.wandoujia.com','/v1/apps','get',allParams,function (err,rows) {

                                if (err){
                                  console.log(err);
                                  return;
                                }

                                rows = rows || [];
                                rows[0] = rows[0] || {};
                                rows[0].apps = rows[0].apps || [];
                                console.log('counter...',counter);
                                console.log('zIndex.....',zIndex);
                                console.log('1st.Http.rows.',rows[0].apps.length);

                                if (rows[0].apps.length&&zIndex<30) {

                                    list = list.concat(rows[0].apps);
                                    console.log('list. ',list.length);
                                    zIndex = zIndex + 1;
                                    isPop[zIndex]++;
                                }else{

                                    //切换网络
                                    if (!zIndex) {
                                        bHttp = true;
                                        aHttp = false;
                                        console.log('change http.2nd.');
                                    }else{
                                        counter = counter + 1;
                                        clearInterval(interval);
                                        console.log('1st.interval finsish.');

                                        console.log('list.. ',list.length);

                                        list = _l.uniqWith(list, _l.isEqual);
                                        console.log('uniqWith. ',list.length);

                                        list = _l.sortBy(list,'downloadCount');
                                        console.log('sortBy..... ',list.length);

                                        //var model = 'week' + subClassify.id;
                                        //console.log('model. check it out. ',model);

                                        list = m.changeApps(list);

                                        async.auto({
                                            truncate: function (callback) {

                                                try {

                                                    var sqlTruncateLatestRanking = 'truncate latestranking';
                                                    console.log('sqlTruncateLatestRanking. check it out. ',sqlTruncateLatestRanking);
                                                    latestRanking.getDatastore().sendNativeQuery(sqlTruncateLatestRanking, function(err, r){
                                                        console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                        callback(null,null);
                                                    });

                                                } catch (e) {
                                                    console.log('truncate err: ', e);
                                                }
                                            },
                                        }, function (err, results) {

                                            var i = 0;
                                            while(list.length) {
                                                var item = list.pop();
                                                var date = m.timestamp();
                                                item.updatedAt = date;
                                                item.createdAt = date;
                                                item.ad = item.ad ? 1 : 0;
                                                latestRanking.create(item).exec(function (err) {
                                                    if (!err) return;
                                                    console.log(err,'\n\n\n');
                                                });
                                            }

                                            isPop = [];
                                            zIndex = 0;
                                        });
                                    }
                                }
                            });
                        }

                        if (!aHttp&&bHttp) {

                            var reqUrl = "http://";
                            var objToken = io.getToken();

                            reqUrl += "api.wandoujia.com/v1/apps";

                            reqUrl += "?";

                            reqUrl += "start=" + zIndex*40;

                            reqUrl += "&";
                            reqUrl += "tag=" + allParams.tag;

                            reqUrl += "&";
                            reqUrl += "max=" + 40;

                            reqUrl += "&";
                            reqUrl += "phone_imei=" + "861374037347422";

                            reqUrl += "&";
                            reqUrl += "type=weekly";

                            reqUrl += "&";
                            reqUrl += "id=baoqianli";

                            reqUrl += "&";
                            reqUrl += "token=" + objToken.apitoken;

                            reqUrl += "&";
                            reqUrl += "timestamp=" + objToken.timestamp;

                            console.log('reqUrl. check it out. ',reqUrl);
                            http.get(reqUrl, function(respone) {

                                var resData = "";
                                respone.on("data",function(data){
                                    resData += data;
                                });
                                respone.on("end", function() {

                                    var rows = JSON.parse(resData);

                                    rows = rows || [];
                                    rows[0] = rows[0] || {};
                                    rows[0].apps = rows[0].apps || [];
                                    console.log('counter...',counter);
                                    console.log('zIndex.....',zIndex);
                                    console.log('2nd.Http.rows.',rows[0].apps.length);

                                    if (rows[0].apps.length&&zIndex<30) {

                                        list = list.concat(rows[0].apps);
                                        console.log('list. ',list.length);
                                        zIndex = zIndex + 1;
                                        isPop[zIndex]++;
                                    }else{

                                        //切换网络
                                        if (!zIndex) {
                                            aHttp = true;
                                            bHttp = false;
                                            isPop[zIndex] = null;
                                            console.log('change http.1st.');
                                        }else{
                                            counter = counter + 1;
                                            clearInterval(interval);
                                            console.log('2nd.interval finsish.');

                                            console.log('list.. ',list.length);

                                            list = _l.uniqWith(list, _l.isEqual);
                                            console.log('uniqWith. ',list.length);

                                            list = _l.sortBy(list,'downloadCount');
                                            console.log('sortBy..... ',list.length);

                                            //var model = 'classify_' + subClassify.id;
                                            //console.log('model. check it out. ',model);

                                            list = m.changeApps(list);

                                            async.auto({
                                                truncate: function (callback) {

                                                    try {


                                                        var sqlTruncateLatestRanking = 'truncate latestranking';
                                                        console.log('sqlTruncateLatestRanking. check it out. ',sqlTruncateLatestRanking);
                                                        latestRanking.getDatastore().sendNativeQuery(sqlTruncateLatestRanking, function(err, r){
                                                            if (err) return;
                                                            console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                                                            callback(null,null);
                                                        });

                                                    } catch (e) {
                                                        console.log('truncate err: ', e);
                                                    }
                                                },
                                            }, function (err, results) {

                                                var i = 0;
                                                while(list.length) {
                                                    var item = list.pop();
                                                    var date = m.timestamp();
                                                    item.updatedAt = date;
                                                    item.createdAt = date;
                                                    item.ad = item.ad ? 1 : 0;
                                                    latestRanking.create(item).exec(function (err) {
                                                        if (!err) return;
                                                        console.log(err,'\n\n\n');
                                                    });
                                                }

                                                isPop = [];
                                                zIndex = 0;
                                            });
                                        }
                                    }
                                });
                            });
                        }

                    }else{

                        if (isPop[zIndex]>200) {
                            list = [];
                            isPop = [];
                            zIndex = 0;
                            aHttp = true;
                            bHttp = false;
                            console.log('the request reset.');
                        }else{
                            isPop[zIndex]++;
                            console.log('wait. check it out. ',isPop[zIndex]);
                        }
                    }
                }catch(e) {
                  console.log(e);
                }
         },50);//1000/50=20

        return res.json({
            data: [],
            code: 200,
            msg: "get peas total ranking data..."
        });
    },

    onfocus: function (req, res) {

        var allParams = req.allParams();
        console.log('onfocus: This is the function entry. check it out: ',req.allParams());
        //return res.badRequest();
        //res.forbidden('Write access required');
        //var model = 'classify_' + 237;
        //var sqlTruncateClassify = 'truncate ' + model;

        //select * from classify_237 order by downloadCount desc limit 30, 10;
        // var sqlTruncateClassify = "select * from " + model;
        // console.log('sqlTruncateClassify. check it out. ',sqlTruncateClassify);
        // sails.getDatastore('peas').sendNativeQuery(sqlTruncateClassify, function(err, r){
        //     if (err) return;
        //     console.log('cb_tag1: The result of this query is shown came out. check it out:  ',r.rows.length);
        //     return res.json({
        //         data: dt.getData(),
        //         code: 200,
        //         msg: ""
        //     });
        // });


        // var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
        // objects = _l.uniqWith(objects, _l.isEqual);
        // console.log('objects. ',objects);
        // return res.json({
        //     data: classifyApps.tableName="xianwiejian",
        //     code: 200,
        //     msg: ""
        // });
        // var _item = {
        //     "ad": 0,
        //     "apks": [
        //         {
        //             "adsType": "NONE",
        //             "bytes": 12566941,
        //             "creation": 1432093522000,
        //             "downloadUrl": {
        //                 "market": "官方",
        //                 "url": "http://apps.wandoujia.com/redirect?signature=8372fc60026url=http%3A%2F%2Fapk.wandoujia.com%2F5%2Fe1%2F251fcb128c836b7a875ae36f6cb0be15.apk0026pn=com.mbt.game.ttxxl0026md5=251fcb128c836b7a875ae36f6cb0be150026apkid=143565440026vc=20026size=125669410026tokenId=baoqianli0026pos=t%2Fapps%2Fcategories%2F%E5%AE%9D%E7%9F%B3%E6%B6%88%E9%99%A4%2Fweekly"
        //             },
        //             "language": [],
        //             "maxSdkVersion": 0,
        //             "md5": "251fcb128c836b7a875ae36f6cb0be15",
        //             "minSdkVersion": 8,
        //             "official": 1,
        //             "paidType": "EMBEDED",
        //             "permissions": [
        //                 "读取手机状态和身份",
        //                 "修改或删除USB存储设备中的内容",
        //                 "从互联网接收数据",
        //                 "查看 Wi-Fi 状态",
        //                 "发送短信（此操作可能需要付费）",
        //                 "监听新安装应用",
        //                 "查看网络状态",
        //                 "装载和卸载文件系统"
        //             ],
        //             "pubKeySignature": "5c5285d81a7b51bc3d870583306c25e9",
        //             "securityStatus": "SAFE",
        //             "signature": "50119d53448d9a94e06ec9fc7579dd57",
        //             "superior": 0,
        //             "targetSdkVersion": 0,
        //             "verified": 2,
        //             "versionCode": 2,
        //             "versionName": "1.1"
        //         }
        //     ],
        //     "appType": "GAME",
        //     "categories": [
        //         {
        //             "alias": "popping",
        //             "level": 1,
        //             "name": "宝石消除",
        //             "type": "GAME"
        //         },
        //         {
        //             "alias": null,
        //             "level": 2,
        //             "name": "卡通",
        //             "type": "GAME"
        //         }
        //     ],
        //     "changelog": "无",
        //     "description": "开心消消消！快乐点点点！微笑每一天！003cbr /003e放开那村长！顺着藤蔓前往“来自星星”的云端之上，003cbr /003e消灭各种障碍，收集足够多的金色豆荚，去拯救神秘的村长大大！003cbr /003e宇宙超人气三消休闲游戏“开心消消消”,终于有安卓版啦！003cbr /003e轻松滑动手指即可操作,玩法简单易上手!003cbr /003e清新可爱的高清画质，Q萌可爱的小动物们...老少皆宜！003cbr /003e再无流量困扰，不用联网也能随时随地开心消消消!003cbr /003e搭地铁、等公车、约会等男盆友/女盆友、坐火车飞机...开心消消消就是打发时间的神器！003cbr /003e千万玩家共同推荐，你一定会喜欢o(*≧▽≦)ツ",
        //     "detailParam": "pos=t%2Fapps%2Fcategories%2F%E5%AE%9D%E7%9F%B3%E6%B6%88%E9%99%A4%2Fweekly",
        //     "developer": {
        //         "email": null,
        //         "id": 99823279,
        //         "intro": null,
        //         "name": "北京摩佰特科技有限公司",
        //         "urls": null,
        //         "verified": null,
        //         "website": null,
        //         "weibo": null
        //     },
        //     "downloadCount": 8030,
        //     "downloadCountStr": "8030 ",
        //     "downloadFinishUrl": null,
        //     "downloadStartUrl": null,
        //     "icons": {
        //         "px48": "http://img.wdjimg.com/mms/icon/v1/e/09/3b90314877163552eb61fc1e6d91c09e_48_48.png",
        //         "px100": "http://img.wdjimg.com/mms/icon/v1/e/09/3b90314877163552eb61fc1e6d91c09e_100_100.png",
        //         "px256": "http://img.wdjimg.com/mms/icon/v1/e/09/3b90314877163552eb61fc1e6d91c09e_256_256.png",
        //         "px78": "http://img.wdjimg.com/mms/icon/v1/e/09/3b90314877163552eb61fc1e6d91c09e_78_78.png",
        //         "px24": "http://img.wdjimg.com/mms/icon/v1/e/09/3b90314877163552eb61fc1e6d91c09e_24_24.png",
        //         "px68": "http://img.wdjimg.com/mms/icon/v1/e/09/3b90314877163552eb61fc1e6d91c09e_68_68.png",
        //         "px36": "http://img.wdjimg.com/mms/icon/v1/e/09/3b90314877163552eb61fc1e6d91c09e_36_36.png"
        //     },
        //     "imprUrl": null,
        //     "installFinishUrl": null,
        //     "installedCount": 6493,
        //     "installedCountStr": "6493 ",
        //     "itemStatus": 1,
        //     "likesRate": 0,
        //     "packageName": "com.mbt.game.ttxxl",
        //     "publishDate": 1431335983000,
        //     "screenshots": {
        //         "small": [
        //             "http://img.wdjimg.com/mms/screenshot/5/f4/5fe88fabeb02deaa2db92d7e1fcd4f45_320_533.jpeg",
        //             "http://img.wdjimg.com/mms/screenshot/d/0c/73c73694b50d70c98f9ba42df00c20cd_320_533.jpeg",
        //             "http://img.wdjimg.com/mms/screenshot/f/5d/8891449215b88ae26fcf6b577b4a55df_320_533.jpeg",
        //             "http://img.wdjimg.com/mms/screenshot/7/05/37d271ca778e838fa3d7f21f967e1057_320_533.jpeg",
        //             "http://img.wdjimg.com/mms/screenshot/9/cd/1d367d6448200136613824b947bebcd9_320_533.jpeg"
        //         ],
        //         "normal": [
        //             "http://img.wdjimg.com/mms/screenshot/5/f4/5fe88fabeb02deaa2db92d7e1fcd4f45.jpeg",
        //             "http://img.wdjimg.com/mms/screenshot/d/0c/73c73694b50d70c98f9ba42df00c20cd.jpeg",
        //             "http://img.wdjimg.com/mms/screenshot/f/5d/8891449215b88ae26fcf6b577b4a55df.jpeg",
        //             "http://img.wdjimg.com/mms/screenshot/7/05/37d271ca778e838fa3d7f21f967e1057.jpeg",
        //             "http://img.wdjimg.com/mms/screenshot/9/cd/1d367d6448200136613824b947bebcd9.jpeg"
        //         ]
        //     },
        //     "start": {
        //         "weeklyStr": "31 "
        //     },
        //     "tagline": "开心快乐点点点！",
        //     "tags": [],
        //     "title": "开心消消消",
        //     "trusted": 0,
        //     "updatedDate": 1432105564000
        // }

        // var date = m.timestamp();
        // _item.updatedAt = date;
        // _item.createdAt = date;

        // _item = m.changeApps([_item]).pop();
        // var keys1 = _.keys(_item);

        // console.log('keys1. ',keys1.length);
        // classifyApps.tableName = 'classify_658';
        // classifyApps.autosubscribe = false;

        // console.log('classifyApps. ',classifyApps);
        // console.log('classifyApps.1 ',classifyApps.tableName);
        // classifyApps.create(item).exec(function (err) {
        //     console.log(err,'\n\n\n');
        // });

        // classifyApps.tableName = 'classify_660';
        // console.log('classifyApps.2 ',classifyApps.tableName);
        // weeklyRanking.create(_item).exec(function (err) {
        //     console.log(err,'\n\n\n');
        // });



        var sqlQuerlClassify = "";
        var classifyArray = dt.getAppsClassify();

        for(var i = 0; i<classifyArray.length; i++) {
            var ele = classifyArray[i];

            if (!i) {
                sqlQuerlClassify += "(select * from classify_" + ele.id +" LIMIT 2)"
            }else{
                sqlQuerlClassify += " UNION ";
                sqlQuerlClassify += "(select * from classify_" + ele.id +" LIMIT 2)"
            }
        }

        console.log('sqlQuerlClassify. check it out. ',sqlQuerlClassify);
        sails.getDatastore('peas').sendNativeQuery(sqlQuerlClassify, function(err, r){
            if (err) return;

            var list = r.rows;


            list = m.changeData(list);
            console.log('cb_tag1: The result of this query is shown came out. check it out:  ',r.rows.length);

            list = m.packageNameUnique(list);
            //list = _l.uniq(list);
            //list = list.unique();
            //list = _l.uniqWith(list, _l.isEqual);
            console.log('uniqWith. ',list.length);

            list = _l.sortBy(list,'downloadCount');
            console.log('sortBy..... ',list.length);

            async.auto({
                truncate: function (callback) {

                    try {

                        var sqlTruncateClassify = 'truncate weeklyranking';
                        console.log('sqlTruncateClassify. check it out. ',sqlTruncateClassify);
                        weeklyRanking.getDatastore().sendNativeQuery(sqlTruncateClassify, function(err, r){
                            console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
                            callback(null,null);
                        });

                    } catch (e) {
                        console.log('truncate err: ', e);
                    }
                },
            }, function (err, results) {

                var i = 0;
                while(list.length) {
                    var item = list.pop();
                    var date = m.timestamp();
                    item.updatedAt = date;
                    item.createdAt = date;
                    item.ad = item.ad ? 1 : 0;

                    var itemMap = new Map(Object.entries(item));
                    var insertSql = m.insertSql(itemMap,'weeklyranking');

                    weeklyRanking.getDatastore().sendNativeQuery(insertSql, function(err, r){
                        if (!err) return;
                        console.log(err,'\n\n\n');
                    });
                }

                return res.json({
                    data: [],
                    code: 200,
                    msg: ""
                });
            });
        });

        // var condition = {appType:'GAME',likesRate:{">":75}};
        // var sortArr = [{downloadCount:'DESC'}];
        // weeklyRanking.find({where:condition}).sort(sortArr).limit(3).exec(function(err,data){
        //     return res.json({
        //         data: data,
        //         code: 200,
        //         msg: ""
        //     });
        // });


        //console.log('. ',_.contains([1, 2, 3], 3));

        // user.create({name:1}).exec(function (err) {
        //     console.log('err. ',err);
        //     if (err) return;
        //     //console.log('cb_tag3: The result of this create is shown came out. check it out: ok');
        //     return res.json({
        //         err: err || 'ok',
        //         code: 200,
        //         msg: ""
        //     });
        // });

        // user
        //     .findOrCreate({
        //         email: '452001414'
        //     }, {
        //         email: 'validationMessages',
        //         username: 'xianweijian'
        //     })
        //     .exec(function(error, user) {
        //         //you will expect the following
        //         //error to exist on error.Errors based on
        //         //your custom validation messages

        //         console.log('test. ',error,user);
        //     });

        // req.session.login = {};
        // req.session.login.name = 'appstore';
        // if (req.session) {
        //     console.log('set session',req.session.mine);
        // }

        // var selectSql = "select icons from appdetails"
        // appDetails.find({sort:'downloadCount DESC'}).exec(function(err,list){
        // // appDetails.getDatastore().sendNativeQuery(selectSql,function (err,list) {
        //     return res.json({
        //         data: list,
        //         code: 200,
        //         msg: ""
        //     });
        // });

        // console.log('self. ',this);
        //console.log('self. ',this['simple/fn'](req, res));
        // var selectSql = "select id from appclassify"
        // appDetails.getDatastore().sendNativeQuery(selectSql,function (err,list) {
        //         console.log(err,list)
        // });

        //var cashkey = allParams.cashkey;
        //var obj = dt.startUpActionCache(cashkey);
        // var keyObj = {};
        // keyObj.key = '/Apps/gotoAppsList/id/baoqianli/max/40/start/20/type/weekly/tag/全部游戏';
        // validity.find(keyObj).exec(function (err, list) {
        //     return res.json({
        //         data: list,
        //         code: 200,
        //         msg: ""
        //     });
        //   // if (err) return;
        //   // console.log('m_tag1: The result of this find is shown came out. check it out: ok');
        //   // validity.create({key,val}).exec(function (err) {
        //   //     if (err) return;
        //   //     console.log('m_tag2: The result of this create is shown came out. check it out: ok');
        //   // });
        // })

        // return res.json({
        //     data: dt.startUpActionCache(allParams.cashkey),
        //     code: 200,
        //     msg: ""
        // });


        // var serchObj = { };
        // serchObj.title = {'like':'%简%'};
        // serchObj.name = { '!=': 'null' };
        // appDetails.find(serchObj).exec(function (err, list) {
        //     console.log(err,list);
        // });

        // client.get("appClassify_*", function(err, reply) {
        //     // reply is null when the key is missing
        //     console.log(reply);
        //     return res.json({
        //         data: reply,
        //         code: 200,
        //         msg: ""
        //     });
        // });

        // var i,j,k;
        // var peasArray = [],parentArray = [],classifyArray = [];
        // client.multi().keys('appClassify_*', function (err, replies) {
        //     // NOTE: code in this callback is NOT atomic
        //     // this only happens after the the .exec call finishes.

        //     console.log("MULTI got " + replies.length + " replies");
        //     replies.forEach(function (reply, index) {
        //         console.log("Reply " + index + ": " + reply.toString());
        //         client.hgetall(reply, function(err, data){
        //             if (_.isObject(data)) {
        //                 peasArray.push(data);

        //                 if (peasArray.length === replies.length) {

        //                     for(i = 0; i<peasArray.length; i++) {
        //                         if (!peasArray[i].parentId) {
        //                             parentArray.push(peasArray[i]);
        //                         }
        //                     }

        //                     for(i = 0; i<parentArray.length; i++) {

        //                         var p = parentArray[i];
        //                         var config = {};

        //                         config.id = p.id;
        //                         config.icon =  p.icon;
        //                         config.type =  p.type;
        //                         config.name =  p.name;
        //                         config.alias =  p.alias;
        //                         config.weight =  p.weight;
        //                         config.banner =  p.banner;
        //                         config.intent =  p.intent;
        //                         config.slogan =  p.slogan;
        //                         config.parentId =  p.parentId;
        //                         config.thumbnail =  p.thumbnail;
        //                         config.groupName =  p.groupName;
        //                         config.relatedIds =  p.relatedIds;
        //                         config.inactiveIcon =  p.inactiveIcon;
        //                         config.defaultAppCount =  p.defaultAppCount;

        //                         config.categoryName = {};
        //                         config.categoryName.name = p.name;
        //                         config.categoryName.level = p.level;
        //                         config.categoryName.alias = p.alias;
        //                         config.categoryName.type = p.themetype;

        //                         config.subCategories = [];

        //                         for(j = 0; j<peasArray.length; j++) {

        //                             var e = peasArray[j];

        //                             var pid = p.id;
        //                             var eid = e.parentId;
        //                             if (_.isEqual(eid,pid)) {

        //                                 var subConfig = {};

        //                                 subConfig.id = e.id;
        //                                 subConfig.icon =  e.icon;
        //                                 subConfig.type =  e.type;
        //                                 subConfig.name =  e.name;
        //                                 subConfig.alias =  e.alias;
        //                                 subConfig.weight =  e.weight;
        //                                 subConfig.banner =  e.banner;
        //                                 subConfig.intent =  e.intent;
        //                                 subConfig.slogan =  e.slogan;
        //                                 subConfig.parentId =  e.parentId;
        //                                 subConfig.thumbnail =  e.thumbnail;
        //                                 subConfig.groupName =  e.groupName;
        //                                 subConfig.relatedIds =  e.relatedIds;
        //                                 subConfig.inactiveIcon =  e.inactiveIcon;
        //                                 subConfig.defaultAppCount =  e.defaultAppCount;

        //                                 subConfig.categoryName = {};
        //                                 subConfig.categoryName.name = e.name;
        //                                 subConfig.categoryName.level = e.level;
        //                                 subConfig.categoryName.alias = e.alias;
        //                                 subConfig.categoryName.type = e.themetype;

        //                                 config.subCategories.push(subConfig);
        //                             }
        //                         }

        //                         classifyArray.push(config);
        //                     }

        //                     //豆子数据
        //                     var _peasArray = classifyArray;
        //                     return res.json({
        //                         data: _peasArray,
        //                         code: 200,
        //                         msg: ""
        //                     });
        //                 }
        //             }
        //         });
        //     });

        // })
        // .exec(function (err, replies) {
        //     console.log("replies. ",replies.length);
        //     // if (classifyArray.length === replies.length) {
        //     //     return res.json({
        //     //         data: classifyArray,
        //     //         code: 200,
        //     //         msg: ""
        //     //     });
        //     // }
        // });

        // client.select(3, function() {
        //     console.log("client: 3");
        //     /* ... */
        // });


        // var redis = sails.config.globals._redis;
        // client.set("string key", "string val", redis.print); // Reply: OK
        // client.hset("hash key", "hashtest 1", "some value", redis.print); //Reply: 1
        // client.hset(["hash key", "hashtest 2", "some other value"], redis.print);//Reply: 1
        // client.hkeys("hash key", function (err, replies) {
        //     console.log(replies.length + " replies:"); //2 replies:
        //     replies.forEach(function (reply, i) {
        //         console.log("    " + i + ": " + reply); // 0: hashtest 1 ; 1: hashtest 2
        //     });
        //     client.quit();
        // });
        // var config = {
        //     host: 'localhost',
        //     password: 'bqlstore0524',
        //     port: 6379,
        //     db:9
        // };

        //var hinst = new rds.createClient("redis://:bqlstore0524@localhost:6379/9");
        // RDS.on("error", function (err) {
        //     console.log("Error " + err);
        // });

        // RDS.on("ready", function () {
        //     console.log("ready ");
        // });

        // var inst = sails.getDatastore('9');
        // inst.createClient({db:9});

        // inst.on("ready", function () {
        //     console.log("ready ");
        // });

        // sails.getDatastore().leaseConnection(function(db, proceed){
        //     console.log('db connection: '+db);
        //     return proceed(undefined, 'fun result');
        // }).exec(function(){
        //     if (arguments[0]) {
        //         console.log('ERROR:', arguments[0]);
        //         return;
        //     } console.log('Ok.  Result:',arguments[1]);
        // })



        // var redis = require("redis"),
        // client = redis.createClient({db:9});


        // redis.createClient(6379, '127.0.0.1', options)

        // // if you'd like to select database 3, instead of 0 (default), call
        // // client.select(3, function() { /* ... */ });

        // client.on("error", function (err) {
        //     console.log("Error " + err);
        // });

        //var client=redis.client({db:9});

        // redis.hmset("xian",{id:1010});

        // redis = "redis://:bqlstore0524@localhost:6379/1"
        // redis.hmset("xian",{id:101});

        // redis.hgetall("xian",function(err,value) {
        //     if (err) {
        //         console.log("xian",err);
        //         return;
        //     };
        //     return res.json({
        //         code:200,
        //         data:value,
        //     })
        // })


        // var mine = req.session.mine;
        // var allParams = req.allParams();

        // var map = new Map();

        // //登录检查
        // //map.set('MINE_CHECK',MINE_CHECK);
        // //参数检查
        // map.set('PASS_CHECK',PASS_CHECK);
        // //空对象检查
        // map.set('VALID_CHECK',VALID_CHECK);
        // //管理员检查
        // //map.set('ADMIND_CHECK',ADMIND_CHECK);

        // //访问检查
        // var acces = gcom.isAccess(req,res,map);
        // if (acces !== 200) return acces;

        // var param;
        // param = {};
        // param.page = 1;
        // param.id = "baoqianli";
        // param.token = apiToken;
        // param.timestamp = nowTime;
        // param.phone_imei = phone_imei;
        // JSON.stringify(param);

        // var options = {
        //     hostname: 'www.google.com',
        //     port: 80,
        //     path: '/upload',
        //     method: 'POST'
        // };

        // var req = http.request(options, function(res) {
        //     console.log('STATUS: ' + res.statusCode);
        //     console.log('HEADERS: ' + JSON.stringify(res.headers));
        //     res.setEncoding('utf8');
        //     res.on('data', function (chunk) {
        //         console.log('BODY: ' + chunk);
        //     });
        // });

        // req.on('error', function(e) {
        //     console.log('problem with request: ' + e.message);
        // });

        // // write data to request body
        // req.write('data\n');
        // req.write('data\n');
        // req.end();

        //common.httpServer(host,path,port,params,callback);

        // var tag = {
        //     id:"245",
        //     alias:"ol",
        //     icon: 'http://img.wdjimg.com/mms/icon/v1/0/f2/2cdc58627da7bc2bc5b1a3a910806f20_78_78.png',
        //     name:"网络游戏",
        //     type:"",
        // }


        // var params = "type=weekly&tag=全部游戏&phone_imei=358584070314555&start=0&max=50ads=1&privacy=1&verified=1";
        // common.httpServer('api.wandoujia.com','/v1/apps',null,params,function (err,recond) {
        //     if (err) {
        //         console.log('err onfocus: ',err);
        //         return;
        //     }
        //     //console.log('cb: ',recond);
        //     return res.json({
        //         data: recond,
        //         code: 200,
        //         msg: "首页"
        //     });
        // })

        // appClassify.count({ id: { '>': 30 }}).exec(function countCB(error, found) {
        //     console.log('There are ' + found + ' users called "Flynn"');
        //     return res.json({
        //         data: [],
        //         code: 200,
        //         msg: "首页"
        //     });
        // });


        // appClassify.findOne({id: 261}).exec(function (err, recond) {
        //     // if (err) return;
        //     console.log(err,recond);
        //     console.log("cb_tag1: The result of this \'findOne \' is shown came out. check it out: ",recond);
        //     return res.json({
        //         data: recond,
        //         code: 200,
        //         msg: "首页"
        //     });
        // });



        // var i,j,k;
        // var peasArray = [],parentArray = [],classifyArray = [];
        // client.multi().keys('appClassify_*', function (err, replies) {
        //     // NOTE: code in this callback is NOT atomic
        //     // this only happens after the the .exec call finishes.

        //     console.log("MULTI got " + replies.length + " replies");
        //     replies.forEach(function (reply, index) {
        //         console.log("Reply " + index + ": " + reply.toString());
        //         client.hgetall(reply, function(err, data){
        //             if (_.isObject(data)) {
        //                 peasArray.push(data);

        //                 if (peasArray.length === replies.length) {

        //                     for(i = 0; i<peasArray.length; i++) {
        //                         if (!peasArray[i].parentId) {
        //                             parentArray.push(peasArray[i]);
        //                         }
        //                     }

        //                     for(i = 0; i<parentArray.length; i++) {

        //                         var p = parentArray[i];
        //                         var config = {};

        //                         config.id = p.id;
        //                         config.icon =  p.icon;
        //                         config.type =  p.type;
        //                         config.name =  p.name;
        //                         config.alias =  p.alias;
        //                         config.weight =  p.weight;
        //                         config.banner =  p.banner;
        //                         config.intent =  p.intent;
        //                         config.slogan =  p.slogan;
        //                         config.parentId =  p.parentId;
        //                         config.thumbnail =  p.thumbnail;
        //                         config.groupName =  p.groupName;
        //                         config.relatedIds =  p.relatedIds;
        //                         config.inactiveIcon =  p.inactiveIcon;
        //                         config.defaultAppCount =  p.defaultAppCount;

        //                         config.categoryName = {};
        //                         config.categoryName.name = p.name;
        //                         config.categoryName.level = p.level;
        //                         config.categoryName.alias = p.alias;
        //                         config.categoryName.type = p.themetype;

        //                         config.subCategories = [];

        //                         for(j = 0; j<peasArray.length; j++) {

        //                             var e = peasArray[j];

        //                             var pid = p.id;
        //                             var eid = e.parentId;
        //                             if (_.isEqual(eid,pid)) {

        //                                 var subConfig = {};

        //                                 subConfig.id = e.id;
        //                                 subConfig.icon =  e.icon;
        //                                 subConfig.type =  e.type;
        //                                 subConfig.name =  e.name;
        //                                 subConfig.alias =  e.alias;
        //                                 subConfig.weight =  e.weight;
        //                                 subConfig.banner =  e.banner;
        //                                 subConfig.intent =  e.intent;
        //                                 subConfig.slogan =  e.slogan;
        //                                 subConfig.parentId =  e.parentId;
        //                                 subConfig.thumbnail =  e.thumbnail;
        //                                 subConfig.groupName =  e.groupName;
        //                                 subConfig.relatedIds =  e.relatedIds;
        //                                 subConfig.inactiveIcon =  e.inactiveIcon;
        //                                 subConfig.defaultAppCount =  e.defaultAppCount;

        //                                 subConfig.categoryName = {};
        //                                 subConfig.categoryName.name = e.name;
        //                                 subConfig.categoryName.level = e.level;
        //                                 subConfig.categoryName.alias = e.alias;
        //                                 subConfig.categoryName.type = e.themetype;

        //                                 config.subCategories.push(subConfig);
        //                             }
        //                         }

        //                         classifyArray.push(config);
        //                     }

        //                     //豆子数据
        //                     var _peasArray = classifyArray;
        //                     return res.json({
        //                         data: _peasArray,
        //                         code: 200,
        //                         msg: ""
        //                     });
        //                 }
        //             }
        //         });
        //     });

        // })
        // .exec(function (err, replies) {
        //     console.log("replies. ",replies.length);
        // });
    },
};
