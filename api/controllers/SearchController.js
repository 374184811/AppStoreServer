/**
 *
 *
 * @description :: search controller/搜索
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
    /**
     * 后台应用搜索接口
     * @param req
     * @param res
     * @param searchword
     */
    search:function(req,res){

        console.log('search: This is the function entry. check it out: ', req.allParams());
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var searchWord = req.param("searchword", false);

        if (!searchWord) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "请输入搜索参数",
                "result": {}
            });
        }

        appDetails.find({where:{'title': {'like':'%'+searchWord+'%'},'unshelve':{'!=':1} } }).sort("setTopTime desc").exec(function (err, account) {
            if (err) return res.negotiate(err);

            if (account == undefined||account.length==0) {
              return res.json({
                "success": false,
                "msgCode": 412,
                "msg": "Not Found",
                "result": {}
              });
            } else {
                //userLogin(serverResult, account,0);
                return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "揾咗",
                    "result": account
                });
            }
        });
    },
    /**
     * 后台应用下架搜索接口
     * @param req
     * @param res
     * @param searchword
     */
    unshelveSearch:function(req,res){

        console.log('unshelveSearch: This is the function entry. check it out: ', req.allParams());
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var searchWord = req.param("searchword", false);

        if (!searchWord) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "请输入搜索参数",
                "result": {}
            });
        }

        appDetails.find({where:{'title': {'like':'%'+searchWord+'%'},'unshelve':'1' } }).sort("unshelveTime desc").exec(function (err, account) {
            if (err) return res.negotiate(err);

            if (account == undefined||account.length==0) {
              return res.json({
                "success": false,
                "msgCode": 412,
                "msg": "Not Found",
                "result": {}
              });
            } else {
                //userLogin(serverResult, account,0);
                return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "揾咗",
                    "result": account
                });
            }
        });

    },
    /**
     * 客户端热词搜索接口
     * Search/hotWordSelect
     * @param req
     * @param res
     * @param selectcon 查询的条件
     * @param imei  手机imei的值
     * @param max 返回热词数据个数，不传，则默认为最大值10个，
     */
    hotWordSelect:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        var selectCon = req.param('selectcon');
        var allParams = req.allParams();
        delete allParams.selectcon;
        var i = 0,param = '';
        for(var keys in allParams) {
            param += i ? '&' : '';
            param += keys + "=";
            param += allParams[keys];
            i = 1;
        }
        console.log(param);
        common.httpServer('api.wandoujia.com','/v1/suggest/'+encodeURIComponent(selectCon),null,'get',param,null,function(err,list){
            if (err) {
                return res.json({
                    "code": 201,
                    "data": list,
                    "msg":'搜索数据'
                });
            }
            console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);

            return res.json({
              "code": 200,
              "data": list,
              "msg":'搜索数据'
            });
        });
    },
    /**
     * 客户端条件搜索接口
     * Search/conSelect
     * @param req
     * @param res
     * @param selectcon 查询的条件
     * @param imei  手机imei的值
     * @param ip  手机ip的值
     * @param mac_address  手机mac_address的值
     * @param phone_model  手机phone_model的值
     * @param api_level 手机api_level的值
     * @param max  每页显示数目
     * @param page  页码
     */
    conSelect:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        var selectCon = req.param('selectcon');
        var allParams = req.allParams();
        allParams.phone_imei = allParams.imei;
        allParams.mac_address = allParams.mac_address;
        allParams.start = allParams.page||0;
        allParams.max = allParams.max||20;

        delete allParams.imei;
        delete allParams.mac;
        delete allParams.selectcon;
        delete allParams.page;

        var i = 0,param = '';
        for(var keys in allParams) {
            param += i ? '&' : '';
            param += keys + "=";
            param += allParams[keys];
            i = 1;
        }
        console.log(param);
        async.series({
            bao:function(callback){
                var where = {
                    'title': {'like':'%'+selectCon+'%'},
                    'unshelve':{'!=':1}
                };
                if(selectCon.indexOf('保千里')>-1){
                    delete where.title;
                }
                console.log(where,selectCon,selectCon.indexOf('保千里'));
                appDetails.find({where:where}).sort("setTopTime desc").exec(function (err, baoapps) {
                    var arr = [];
                    if(baoapps.length > 0){
                        for(var i=0;i < baoapps.length;i++){
                            var a = appDetails.dataFormat(baoapps[i]);
                            arr.push(a);
                        }
                    }
                    callback(err,arr);
                });
            },
            pea:function(callback){
                common.httpServer('api.wandoujia.com','/v1/search/'+encodeURIComponent(selectCon),null,'get',param,null,function(err,peaapps){
                    peaapps['appList'] = peaapps['appList']||[];
                    if(peaapps['appList'].length>0){
                        for(var i=0;i<peaapps['appList'].length;i++){//去掉阿里的数据
                            if(peaapps['appList'][i]['packageName'] == 'com.sina.weibo'){
                                peaapps['appList'].splice(i,1);
                            }else if(peaapps['appList'][i]['packageName'] == 'com.taobao.fleamarket'){
                                peaapps['appList'].splice(i,1);
                            } else if(peaapps['appList'][i]['packageName'] == 'cn.nldx.mdzjz2'){
                                peaapps['appList'].splice(i,1);
                            }
                        }
                    }
                    callback(err,peaapps);
                });
            }
        },function(err,results){
            if (err){
                return res.json({
                    "code": 201,
                    "data": [],
                    "msg":'搜索数据'
                });
            }
            var appList = results['pea']['appList']||[];
            var list = results['bao'].concat(appList);
            results['pea']['appList'] = list;
            return res.json({
                "code": 200,
                "data": results['pea'],
                "msg":'搜索数据'
            });
        });
    },
    /**
     * 关键词接口
     * Search/keyWordSelect
     * @param req
     * @param res
     * @param imei  手机imei的值
     */
    keyWordSelect:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        var allParams = req.allParams();
        allParams.start = 0;
        allParams.max = 6;
        allParams.type = 'weekly';
        async.auto({
            app:function(cb){
                allParams.tag = encodeURIComponent('全部应用');
                var i = 0,param = '';
                for(var keys in allParams) {
                    param += i ? '&' : '';
                    param += keys + "=";
                    param += allParams[keys];
                    i = 1;
                }
                console.log(param);
                common.httpServer('api.wandoujia.com','/v1/apps',null,'get',param,null,function(err,list1){
                    cb(err,list1);
                });
            },
            game:function(cb){
                allParams.tag = encodeURIComponent('全部游戏');
                var i = 0,param = '';
                for(var keys in allParams) {
                    param += i ? '&' : '';
                    param += keys + "=";
                    param += allParams[keys];
                    i = 1;
                }
                console.log(param);
                common.httpServer('api.wandoujia.com','/v1/apps',null,'get',param,null,function(err,list2){
                    cb(err,list2);
                });
            }
        },function (err, results) {
            if(err){
                return res.json({
                    "code": 201,
                    "data": [],
                    "msg":'关键词数据'
                });
            }

            var app = [];
            var game = [];
            if(results.app.length>0){
                app = results.app[0].apps;
            }
            if(results.game.length>0){
                game = results.game[0].apps;
            }
            var dataArr = app.concat(game);
            var titleArr = new Array();
            for(var i=0;i<dataArr.length;i++){
                titleArr.push(dataArr[i].title);
            }
            return res.json({
                "code": 200,
                "data": titleArr,
                "msg":'关键词数据'
            });
        });
    },
    /**
     * 搜索框初始值接口
     * Search/initVulSelect
     * @param req
     * @param res
     */
    initVulSelect:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        appDetails.find({where:{'unshelve':{'!=':1}},select:['title','packageName']}).sort('downloadCount DESC').limit(5).exec(function(err,result){
            if(err){
                console.log('err. initVulSelect',err);
                return;
            }
            return res.json({
                "code": 200,
                "data": result,
                "msg":'搜索默认值数据'
            });
        });
    }

};
