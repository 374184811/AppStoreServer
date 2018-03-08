/**
 * DownloadController
 *
 * @description ::
 * @help        ::
 */
var _l = require('../services/lodash');
module.exports = {
    /**
     * 应用升级接口
     * Download/upgrade
     * @param req
     * @param res
     * @param data  应用数据
     * @param sdkVersion  用户手机的sdkVersion
     * @param imei  手机imei的值
     */
    upgrade:function(req,res){
        console.log(req.ip,req.path);

        var dataObj = req.param('data');
        var sdkVersion = req.param('sdkVersion');
        var phone_imei = req.param('imei');

        // console.log('dataObj----',typeof dataObj);
        var userApps = dataObj['userApps']||[];
        var sysApps = dataObj['sysApps']||[];
        var initLen = userApps.length;
        var data = {model:dataObj['model'],sdkVersion:parseInt(dataObj['sdkVersion']),resolution:dataObj['resolution'],sysApps:[],userApps:[]};
        var arr1 = [],arr2 = [];
        console.log('I ----> ',new Date().format('yyyy-MM-dd hh:mm:ss.S'));
        async.auto({
            bao1:function(callback) {
                var j = 0;
                try{
                    if(sysApps.length<1){
                        callback(null,[]);
                    }else {
                        sysApps.forEach(function(item,index){
                            appDetails.find({
                                packageName:item.packageName,
                                // md5:item.cerStrMd5,
                                versionCode:{">":parseInt(item.versionCode)}
                            }).exec(function(err,result){
                                if(result.length>0){
                                    j++;
                                    sysApps.remove(sysApps[index]);
                                    var a = appDetails.updateFormat(result[0]);
                                    arr1.push(a);
                                    if(initLen == j){
                                        console.log(j,initLen);
                                        data.sysApps = sysApps;
                                        callback(null,arr1);
                                    }
                                }else{
                                    j++;
                                    if(initLen == j){
                                        console.log(j,initLen);
                                        data.sysApps = sysApps;
                                        callback(null,arr1);
                                    }
                                }
                            });
                        });
                    }
                }catch(e){
                    callback(e,[]);
                }
            },
            bao2:function(callback) {
                var j = 0;
                try{
                    if(userApps.length<1){
                        callback(null,[]);
                    }else {
                        userApps.forEach(function(item,index){
                            appDetails.find({
                                packageName:item.packageName,
                                // md5:item.cerStrMd5,
                                versionCode:{">":parseInt(item.versionCode)}
                            }).exec(function(err,result){
                                if(result.length>0){
                                    j++;
                                    userApps.remove(userApps[index]);
                                    var a = appDetails.updateFormat(result[0]);
                                    arr2.push(a);
                                    if(initLen == j){
                                        console.log(j,initLen);
                                        data.userApps = userApps;
                                        callback(null,arr2);
                                    }
                                }else{
                                    j++;
                                    if(initLen == j){
                                        console.log(j,initLen);
                                        data.userApps = userApps;
                                        callback(null,arr2);
                                    }
                                }
                            });
                        });
                    }
                }catch(e){
                    callback(e,[]);
                }
            },
            pea:['bao1','bao2',function(results,callback){
                var params = {sdkVersion:parseInt(sdkVersion),phone_imei:phone_imei};
                common.httpServer('api.wandoujia.com','/v1/update',null,'post',params,data,function(err,data){
                    callback(err,{bao1:results.bao1,bao2:results.bao2,peas:data});
                });
            }]
        },function(err,results){
            if (err){
                console.log(err);
                return;
            }

            // var finalArr = results['bao'].concat(results['pea']['userApps']);
            // results.pea.userApps = finalArr;

            var data = results['pea'];
            var finalUserApps = data['bao1'].concat(data['peas']['userApps']);
            var finalSysApps = data['bao2'].concat(data['peas']['sysApps']);
            data.peas.userApps = finalUserApps;
            data.peas.sysApps = finalSysApps;
            console.log('II ----> ',new Date().format('yyyy-MM-dd hh:mm:ss.S'));
            return res.json({code:200,data:data.peas,msg:'更新数据'});
        });
    },
    /**
     * 文件、图片上传接口,Download/fileUpload
     * @param dir 文件的路径,dir- icons:图标 images:图片 apks:应用 files:文件
     * @param type 类型，1-图片(icons/images)，2-文件(apks/files)
     * @param req
     * @param res
     */
    fileUpload:function(req,res){
        console.log(req.ip,req.path,req.allParams());
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }
        var dir = req.param('dir');
        var type = req.param('type');
        if(type == 1){
            common.uploadImg(req,dir,true,function(data){
                return res.json(data);
            });
        } else if(type == 2) {
            common.uploadFile(req,dir,function(data){
                return res.json(data);
            });
        }
    },
    /**
     * 存储apk的fileMD5数据
     * Download/saveApkMsg
     * @param req
     * @param res
     * @param sysApps 系统应用数据
     * @param userApps 用户自己装的应用数据
     * @param model 手机的model
     */
    saveApkMsg:function(req,res){
        console.log(req.ip,req.path);

        var allParams = req.allParams();
        var data = allParams['data'];
        var sysApps = allParams['sysApps'];
        var userApps = allParams['userApps'];
        var model = allParams['model'];
        var arr = sysApps.concat(userApps);

        async.auto({
            ckeck:function (callback) {
                var j = 0,i = 0,k = 0;
                if(arr.length>0){
                    arr.forEach(function (item) {
                        var selectCon = item['packageName'] + ':' + item['versionCode'];
                        var selectObj1 = {
                            packageName: item['packageName'],
                            versionCode: item['versionCode'],
                            versionName: item['versionName'],
                            cerStrMd5: item['cerStrMd5']
                        };
                        var selectObj2 = {
                            model: model,
                            packageName: item['packageName'],
                            fileMd5: item['fileMd5'],
                            versionCode: item['versionCode'],
                            versionName: item['versionName'],
                            cerStrMd5: item['cerStrMd5'],
                            selectcon: selectCon,
                            createdat: (new Date()).format('yyyy-MM-dd hh:mm:ss')
                        };

                        appCheckMsg.findOrCreate(selectObj1,selectObj2).exec(function(err,appcheckmsg,wasCreated){
                            if (err) { return res.serverError(err);}

                            if(wasCreated) {
                                i++;
                            }else {
                                k++;
                            }

                            if (++j == arr.length){
                                console.log('Created '+ i +' new record',' ======== Found '+ k + ' existing record');
                                callback(err,appcheckmsg);
                            }
                        });
                    });
                }else{
                    callback(null,[]);
                }
            }
        },function(err,resultes){
            if (err){
                console.log(err);
                return;
            }

            return res.json({
                code: 200,
                msg: 'ok'
            });
        });
    },
    /**
     * 获取apk的fileMD5数据
     * Download/getApkMsg
     * @param req
     * @param res
     * @param sysApps 系统应用数据
     * @param userApps 用户自己装的应用数据
     */
    getApkMsg:function(req,res){
        console.log(req.ip,req.path);

        var allParams = req.allParams();
        var sysApps = allParams['sysApps'];
        var userApps = allParams['userApps'];

        async.auto({
            sys:function (callback) {//系统app
                var j = 0,selectStr = '';
                for(var i=0;i<sysApps.length;i++){
                    selectStr += j ? ',':'';
                    selectStr += '\''+sysApps[i]['packageName'] + ':' + sysApps[i]['versionCode']+'\'';
                    j = 1;
                }

                var selectStr1 = 'SELECT packageName,fileMd5,versionCode,versionName,cerStrMd5 FROM appcheckmsg WHERE selectcon in ('+ selectStr +')';
                console.log(selectStr1);
                appCheckMsg.getDatastore().sendNativeQuery(selectStr1,function (err,apkmsgs) {
                    callback(err,apkmsgs);
                });
            },
            user:function (callback) {//用户自己装的app
                var j = 0,selectStr = '';
                for(var i=0;i<userApps.length;i++){
                    selectStr += j ? ',':'';
                    selectStr += '\''+userApps[i]['packageName'] + ':' + userApps[i]['versionCode']+'\'';
                    j = 1;
                }

                var selectStr2 = 'SELECT packageName,fileMd5,versionCode,versionName,cerStrMd5 FROM appcheckmsg WHERE selectcon in ('+ selectStr +')';
                console.log(selectStr2);
                appCheckMsg.getDatastore().sendNativeQuery(selectStr2,function (err,apkmsgs) {
                    callback(err,apkmsgs);
                });
            }
        },function(err,resultes){
            if (err){
                console.log(err);
                return;
            }

            var data = {};
            data.sysApps = resultes.sys['rows'] || [];
            data.userApps = resultes.user['rows'] || [];

            data.sysNoApps = _l.differenceBy(sysApps,resultes.sys['rows'],'packageName');
            data.userNoApps = _l.differenceBy(userApps, resultes.user['rows'],'packageName');

            return res.json({
                code: 200,
                data: data
            });
        });
      },
    /**
     * 定时拉取app广告数据函数
     * Download/grabAdsData
     * @param req
     * @param res
     * @param sysApps 系统应用数据
     * @param userApps 用户自己装的应用数据
     */
    grabAdsData:function (req, res) {
        console.log(req.ip,req.path);

        dt.gotoGetAdsPeas();

        return res.json({
            code:200,
            data:[],
            msg:'抓取数据'
        });
    },
};

