
/**
 * AppsController.js
 *
 * @description :: 控制器定义，该控制器用于展示应用榜单相关信息
 * @docs        :: 无
 */
var _l = require('../services/lodash');
module.exports = {

    /**
    * 豆子榜单视图
    *
    * 这个函数用于获取应用榜单列表，
    *
    * @return { 结果集 }
    */
    gotoAppsList: function(req, res) {
        console.log('gotoAppsList: This is the function entry. check it out: ', req.allParams());

        var allParams = req.allParams();

        var map = new Map();

        //控制器检查
        map.set('OPTION_CHECK',OPTION_CHECK);

        //访问检查
        var acces = ck.isAccess(req,res,map);
        if (acces !== 200) return acces;

        // var hashCacheKey = dt.hashCacheKey(req.path,allParams);
        // var hashCacheVal = dt.startUpActionCache(hashCacheKey);
        // console.log('hashCacheKey. ',hashCacheKey, ' is ', hashCacheVal?true:false);

        var tag = allParams.tag;
        var max = allParams.max;
        var param = "", zIndex = 0;
        var start = allParams.start;
        var curpage = allParams.start;

        var nextPage = allParams.start * max;
        var classifyId = dt.getAppsClassifyId(tag);

        if (!classifyId) {
            return res.json({
                data: [],
                code: 200,
                msg: "类别不存在"
            });
        }

        async.parallel({

            a: function(cb) {


                appDetails.find({ or: [{'class1': tag}, {'class2': tag}] }).exec(function(err,list){
                    if (err) return;
                    console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                    cb(err,list);
                });

            },

            b: function(cb) {

                var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit " + nextPage + ", " + max;
                console.log('sqlQueryClassify. check it out. ',sqlQueryClassify);
                sails.getDatastore('peas').sendNativeQuery(sqlQueryClassify, function(err, r){
                    if (err) return;
                    console.log('cb_tag2: The result of this query is shown came out. check it out:  ',r.rows.length);
                    cb(err,r.rows);
                });

                // io.connect('api.wandoujia.com','/v1/apps','get',req,allParams,function (err,list) {
                //     if (err) return;
                //     console.log('cb_tag2: The result of this find is shown came out. check it out: ',list.length);
                //     cb(err,list);
                // });

                // for(var keys in allParams) {
                //     if (zIndex) {
                //         param +='&'
                //     }
                //     param += keys;
                //     param += "="
                //     param += encodeURIComponent(allParams[keys]);
                //     zIndex += 1;
                // }

                // console.log('param. check it out. ',param);
                // common.httpServer('api.wandoujia.com','/v1/apps',null,'get',param,null,function (err,list) {
                //     if (err) {
                //         console.log('err onfocus: ',err);
                //         return;
                //     }

                //     console.log('cb_tag2: The result of this find is shown came out. check it out: ',list.length);
                //     cb(err,list);
                // });
            },
        }, function (err, results) {

            results = results || {};
            results.a = results.a || [];
            results.b = results.b || [];
            results.a = m.getApps(results.a);
            results.a = m.sortApps(results.a);
            results.b = m.parseApps(results.b);
            results.b = m.filtersApp(results.b);

            results.b = results.b || [];
            //results.b[0].apps = results.b[0].apps || [];
            //console.log('length. check it out. ',results.b[0].apps.length);

            var i,j;
            var index,list,maxPage;

            list = list || utils.clone(results.b);
            //console.log('list.length. check it out. ',list.length);

            maxPage = parseInt(list.length/5) + (list.length%5>0 ? 1 : 0);
            //console.log('maxPage. check it out. ',maxPage);

            var listItem = [];
            for(i = 0; i<maxPage; i++) {
                var _start = i * 5;
                var _max = (i + 1) * 5
                var _list = list.slice(_start,_max);
                //console.log('_list. check it out. ',_list.length);

                var secondApp,fifthApp;
                var idx = start * maxPage + i;
                if (!parseInt(idx)&&results.a[idx]) {
                    secondApp = results.a[idx];
                }else{

                    secondApp = results.a[m.changeIndex(idx)];
                    fifthApp = results.a[m.changeNextIdx(idx+1)];
                }

                console.log('curpage',start,' max. ',max, ' num. ',idx);

                //首页插入第二个APP
                if (!idx) {
                    //console.log('secondApp. check it out. ',_list.length);

                    if(!_list.length) {

                        if (secondApp) {
                            _list.push(secondApp);
                            console.log('default inser to second app');
                        }

                    }else{

                        if (secondApp) {
                            console.log('inser to second app');
                            _list.splice(1, 0, secondApp);
                        }

                    }

                //次页插入第二个，第五个APP
                }else{

                    //console.log('fifthApp. check it out. ',_list.length);

                    //没有数据 或 数据不足 依次插入
                    if(!_list.length || _list.length<2) {

                        if (secondApp) {
                            _list.push(secondApp);
                            console.log('default inser to 2nd app');
                        }

                    //正常插入保千里应用
                    }else {

                        if (secondApp) {
                            _list.splice(1, 0, secondApp);
                            console.log('inser to 2nd app');
                        }
                    }

                    //没有数据 或 数据不足 依次插入
                    if(!_list.length || _list.length<4) {

                        if (fifthApp) {
                            _list.push(fifthApp);
                            console.log('default inser to fifth app');
                        }

                    //正常插入保千里应用
                    }else {

                        if (fifthApp) {
                           _list.splice(5, 0, fifthApp);
                           console.log('inser to fifth app');
                        }
                    }
                }

                var l = _list.slice();
                for(j = 0;j<l.length; j++){
                    listItem.push(l[j]);
                }

            }

            results.b = m.changeApps(listItem);
            return res.json({
                data: results.b,
                code: 200,
                msg: "测试获取"
            });
        });
    },
    /**
     * 应用详情接口
     * Apps/detailedInfo
     * @param req
     * @param res
     * @param phone_imei   手机imei的值
     * @param packagename  应用包名
     * @param detailParam  详细数据参数，广告应用必须传，别的应用可传可不传
     */
    detailedInfo:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        var packageName = req.param('packagename');
        var from = 0;
        var allParams = req.allParams();
        var detailParam = allParams.detailParam;

        async.auto({
            bao:function(callback){
                appDetails.find({packageName:packageName}).exec(function(err,result){
                    callback(err,result);
                });
            },
            pea:['bao',function(data,callback){
                var bao = data.bao;
                if(bao.length>0){
                    var b = appDetails.dataFormat(bao[0]);
                    from = true;
                    callback(null,b);
                }else{
                    var params = "phone_imei="+allParams.imei;
                    // if(detailParam.indexOf('isAds=true')>-1){
                        params += '&' + detailParam;
                    // }
                    common.httpServer('api.wandoujia.com','/v1/apps/'+packageName,null,'get',params,null,function(err,detail){
                        from = false;
                        callback(err,detail);
                    });
                }
            }]
        },function(err,results){
            if (err) {
                console.log('err : ',err);
                return;
            }else{
                return res.json({
                    data: results.pea,
                    protruly:from,
                    code: 200,
                    msg: "应用详细数据"
                });
            }
        });
    },
    /**
     * 应用权限设置接口
     * Apps/setAuth
     * @param req
     * @param res
     * @param  phone_imei 手机imei的值
     * @param  autharr  权限数组
     */
    setAuth:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        var imei = req.param('imei');
        var authArr = req.param('autharr');
        async.auto({
            one:function (callback) {
                authority.find({imei:imei}).exec(function(err, result){
                    callback(err, result);
                });
            },
            two:['one',function(data,callback){
                var one = data.one;
                async.mapSeries(authArr,function(item,cb){
                    var set = 0;
                    if (item.set == true){
                        set = 1;
                    }
                    if (one.length){
                        authority.update({imei:imei,authmsg:item.authmsg},{set:set}).meta({fetch: true}).exec(function(err,data){
                            cb(err,data);
                        });
                    }else{
                        authority.create({imei:imei,authmsg:item.authmsg,set:set}).meta({fetch: true}).exec(function(err,data){
                            cb(err,data);
                        });
                    }
                },function(err,result){
                    callback(err,result);
                });
            }]
        },function(err,results){
            if (err){
                console.log(err);
                return;
            }
            return res.json({code:200,msg:'权限数据存储'});
        });
    },
    /**
     * 应用权限获取接口
     * Apps/getAuth
     * @param req
     * @param res
     * @param phone_imei 手机的imei的值
     */
    getAuth:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        var imei = req.param('imei');
        authority.find({imei:imei}).exec(function(err,result){
            if (err){
                console.log(err);
                return;
            }
            if (result.length<1){
                return res.json({code:400,data:result,msg:'权限数据获取无'});
            }
            result.forEach(function(item){
                if(item.set == 1){
                    item.set = true;
                }else{
                    item.set = false;
                }
            });

            console.log('Auth length is :',result.length);

            return res.json({code:200,data:result,msg:'权限数据获取'});
        });
    },
    /**
     * 获取广告数据接口
     * Apps/getAdsData
     * @param req
     * @param res
     */
    getAdsData:function (req,res) {
        console.log(req.ip,req.path);

        var adsSql = 'SELECT apks,classify,tags,icons,start,developer,categories,screenshots,title,packageName,downloadCount,description,imprUrl,';
        adsSql +=  'downloadStartUrl,downloadFinishUrl,installFinishUrl,detailParam FROM adsapp';
        console.log(adsSql);
        adsapp.getDatastore().sendNativeQuery(adsSql,function(err,ads){
            if (err){
                console.log(err);
                return;
            }

            if (!ads.rows){
                return res.json({
                    code:201,
                    data:[],
                    msg:'无数据'
                });
            }

            var arr = ads.rows;
            arr = _l.uniqBy(arr,'packageName');
            // console.log('cb_msg: arr length is ',arr.length);
            arr = m.parseApps(arr);//数据格式转换
            arr = arr.randomEle(arr,4);//数组拿随机个数元素

            return res.json({
                code: 200,
                data: arr,
                msg: '抓取数据'
            });
        });
    },
};
