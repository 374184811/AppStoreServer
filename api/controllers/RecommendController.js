/**
 * DownloadController
 *
 * @description ::
 * @help        ::
 */

module.exports = {
    /**
     * 推荐页面数据接口
     * Recommend/page
     * @param req
     * @param res
     * @param imei 手机的imei值
     * @param page 第几页，默认值是0
     * @param max 一页数据最大值，默认为2
     */
    page:function(req,res){
        console.log(req.ip,req.path,req.allParams());
        var self = this;
        
        var page = req.param('page')||0;
        var max = req.param('max')||2;
        var skip = page * max;
        async.parallel({
            topic:function(cb) {
                topic.find({where:{'isshow':{'!=':0}},select:['id','name','type']}).skip(skip).limit(max).exec(function(err,result2){
                    if(err){
                        cb(err,result2);
                    }else{
                        if(result2.length>0){
                            self['recommend/filter'](req,result2,cb);
                        }else{
                            cb(err,result2);
                        }
                    }
                });
            }
        },function(err,list){
            if (err){
                console.log(err);
                return;
            }
            
            var arr = [];
            var topic = list.topic;
            for(var i=0;i<topic.length;i++){
                arr = arr.concat(topic[i]);
            }
            list.topic = arr;
          
            return res.json({data:list,code:200,msg:'推荐数据'});
        });
    },
    /**
     * 推荐页更多数据
     * Recommend/more
     * @param req
     * @param res
     * @param id  专题栏目的id
     * @param imei  手机imei的值
     * @param page  页码(不传值，默认值为：0，也就是第一页拿数据)
     * @param max  每页取值大小(不传值，默认值为：20)
     */
    more:function(req,res){
        console.log(req.ip,req.path,req.allParams());

        var allParams = req.allParams();
        var map = new Map();
        //控制器检查
        map.set('OPTION_CHECK',OPTION_CHECK);
        //访问检查
        var acces = ck.isAccess(req,res,map);
        if (acces !== 200) return acces;
      
        var id = Number(allParams.id);
        var max = Number(allParams.max)||20;
        var imei = allParams.imei;
        var page = Number(allParams.page)||0;
        var start = page * max;
      
        switch (id){
            case 1://保千里专题
                var sortArr = [{setTopTime:'DESC'},{orderId:'ASC'}];//.skip(index).limit(max)
                appDetails.find({where:{'unshelve':{'!=':1}}}).sort(sortArr).exec(function(err,result){
                    if(err){
                        console.log(err);
                        return;
                    }
                    var dataArr = [];
                    var arr1 = result;
                    if(result.length>0){
                        for(var k=0;k<arr1.length;k++){
                            var b = appDetails.dataFormat(arr1[k]);
                            dataArr.push(b);
                        }
                    }
                    return res.json({
                        code:200,
                        data:{data:dataArr,subclass:'',parentclass:''},
                        msg:'更多数据'
                    });
                });
                break;
            case 2://必备应用
                var condition = {appType:'APP'};
                var sortArr = [{downloadCount:'DESC'}];
                weeklyRanking.find({where:condition}).sort(sortArr).skip(start).limit(max).exec(function(err,data){
                    if(err){
                        console.log(err);
                        return;
                    }
                    // var result = m.parseApps(data);
                    return res.json({
                        code:200,
                        data:{data:data,subclass:'',parentclass:''},
                        msg:'更多数据'
                    });
                });
                break;
            case 3://必玩游戏
                var condition = {appType:'GAME'};
                var sortArr = [{downloadCount:'DESC'}];
                weeklyRanking.find({where:condition}).sort(sortArr).skip(start).limit(max).exec(function(err,data){
                    if(err){
                        console.log(err);
                        return;
                    }
                    // var result = m.parseApps(data);
                    return res.json({
                        code:200,
                        data:{data:data,subclass:'',parentclass:''},
                        msg:'更多数据'
                    });
                });
                break;
            case 4://热门推荐
                var condition = {likesRate:{">":75}};
                var sortArr = [{downloadCount:'DESC'}];
                weeklyRanking.find({where:condition}).sort(sortArr).skip(start).limit(max).exec(function(err,data){
                    if(err){
                        console.log(err);
                        return;
                    }
                    // var result = m.parseApps(data);
                    return res.json({
                        code:200,
                        data:{data:data,subclass:'',parentclass:''},
                        msg:'更多数据'
                    });
                });
                break;
            case 5://游戏新品速递
                var condition = {appType:'GAME'};
                var sortArr = [{downloadCount:'ASC'}];
                weeklyRanking.find({where:condition}).sort(sortArr).skip(start).limit(max).exec(function(err,data){
                    if(err){
                        console.log(err);
                        return;
                    }
                    // var result = m.parseApps(data);
                    return res.json({
                        code:200,
                        data:{data:data,subclass:'',parentclass:''},
                        msg:'更多数据'
                    });
                });
                break;
            case 7://五星精品游戏
                // var condition = {appType:'GAME',likesRate:{">":75}};
                // var sortArr = [{downloadCount:'DESC'}];
                // totalRanking.find({where:condition}).sort(sortArr).skip(start).limit(max).exec(function(err,data){
                //     if(err){
                //         console.log(err);
                //         return;
                //     }
                //     // var result = m.parseApps(data);
                //     return res.json({
                //         code:200,
                //         data:{data:data,subclass:'',parentclass:''},
                //         msg:'更多数据'
                //     });
                // });
  
                var classifyId = dt.getAppsClassifyId('网络游戏');
                var sqlQueryClassify = "select * from classify_" + classifyId + " where likesRate > 75 order by downloadCount desc limit "+start+","+max;
                console.log(sqlQueryClassify);
                sails.getDatastore('peas').sendNativeQuery(sqlQueryClassify, function(err, data) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    var dataArr = data.rows||[];
                    var result = m.parseApps(dataArr);
                    return res.json({
                        code:200,
                        data:{data:result,subclass:'',parentclass:''},
                        msg:'更多数据'
                    });
                });
                break;
            case 8://本周优质游戏
                var condition = {appType:'GAME',likesRate:{">":75}};
                var sortArr = [{downloadCount:'DESC'}];
                weeklyRanking.find({where:condition}).sort(sortArr).skip(start).limit(max).exec(function(err,data){
                    if(err){
                        console.log(err);
                        return;
                    }
                    // var result = m.parseApps(data);
                    return res.json({
                        code:200,
                        data:{data:data,subclass:'',parentclass:''},
                        msg:'更多数据'
                    });
                });
                break;
            case 6://网游风云榜
                var classifyId = dt.getAppsClassifyId('网络游戏');
                var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit "+start+","+max;
                console.log(sqlQueryClassify);
                sails.getDatastore('peas').sendNativeQuery(sqlQueryClassify, function(err, data) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    var dataArr = data.rows||[];
                    var result = m.parseApps(dataArr);
                    return res.json({
                        code:200,
                        data:{data:result,subclass:'',parentclass:''},
                        msg:'更多数据'
                    });
                });
                break;
            case 9://休闲益智游戏
                var classifyId = dt.getAppsClassifyId('休闲时间');
                var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit "+start+","+max;
                classFun(sqlQueryClassify,['休闲时间'],function(resulObj){
                    return res.json({code:200,data:resulObj,msg:'更多数据'});
                });
                break;
            case 10://发现好音乐
                var classifyId = dt.getAppsClassifyId('音乐');
                var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit "+start+","+max;
                classFun(sqlQueryClassify,['音乐'],function(resulObj){
                    return res.json({code:200,data:resulObj,msg:'更多数据'});
                });
                break;
            case 11://玩滤镜,拍视频
                var classifyId = dt.getAppsClassifyId('图像');
                var sqlQueryClassify = "select * from classify_" + classifyId + " where likesRate > 80 order by downloadCount desc limit "+start+","+max;
                classFun(sqlQueryClassify,['图像'],function(resulObj){
                    return res.json({code:200,data:resulObj,msg:'更多数据'});
                });
                break;
            case 12://年轻人的社交
                var classifyId = dt.getAppsClassifyId('聊天社交');
                var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit "+start+","+max;
                classFun(sqlQueryClassify,['聊天社交'],function(resulObj){
                    return res.json({code:200,data:resulObj,msg:'更多数据'});
                });
                break;
            case 13://看视频 追剧
                var classifyId = dt.getAppsClassifyId('视频');
                var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit "+start+","+max;
                classFun(sqlQueryClassify,['视频'],function(resulObj){
                    return res.json({code:200,data:resulObj,msg:'更多数据'});
                });
                break;
        }
      
        function classFun(sqlstr,classarr,callback){
            console.log(sqlstr);
            sails.getDatastore('peas').sendNativeQuery(sqlstr, function(err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                var dataArr = data.rows||[];
                var result = m.parseApps(dataArr);
                
                var where = '', j = 0;
                for (var i = 0; i < classarr.length; i++) {
                    if (j == 1) {
                        where += ' or ';
                    }
                    where += " name = '" + classarr[i] + "'";
                    j = 1;
                }
                var queryStr1 = "SELECT id FROM appclassify WHERE" + where;
                console.log(queryStr1);
                sails.getDatastore().sendNativeQuery(queryStr1).exec(function (err, one) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    var arr2 = [];
                    for (var i = 0; i < one['rows'].length; i++) {
                        arr2.push(one['rows'][i].id);
                    }
                    console.log(arr2);
                    var queryStr2 = "SELECT name FROM appclassify WHERE parentId IN (" + arr2.join(',') + ")";
                    console.log(queryStr2);
                    sails.getDatastore().sendNativeQuery(queryStr2).exec(function (err, two) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        var obj2 = {};
                        var arr3 = [];
                        for (var j = 0; j < two['rows'].length; j++) {
                            arr3.push(two['rows'][j].name);
                        }
                        obj2.data = result;
                        obj2.subclass = arr3;
                        obj2.parentclass = {name: classarr.join(','), alias: '全部'};
                        callback(obj2);
                    });
                });
            });
        }
    },
    /**
     * 区别取值函数
     * req 请求参数
     * @param req
     * @param arr  区分数组
     * @param cb 回调函数
     */
    filter:function(req,arr,cbfun){
        var allParams = req.allParams();
      
        delete allParams.page;
        allParams.phone_imei = allParams.imei;
        allParams.start = 0;
        
        var filterArr = arr;
        async.mapSeries(filterArr,function(item,callback){
            var itemArr = [];
            switch (item.id){
                case 1://保千里专题
                    break;
                case 2://必备应用
                    var condition = {appType:'APP'};
                    var sortArr = [{downloadCount:'DESC'}];
                    weeklyRanking.find({where:condition}).sort(sortArr).limit(3).exec(function(err,data){
                        var itemObj = new Object();
                        itemObj.id = item.id;
                        itemObj.name = item.name;
                        itemObj.type = item.type;
                        itemObj.data = data||[];
                        itemArr.push(itemObj);
                        callback(err,itemArr);
                    });
                    break;
                case 3://必玩游戏
                    var condition = {appType:'GAME'};
                    var sortArr = [{downloadCount:'DESC'}];
                    weeklyRanking.find({where:condition}).sort(sortArr).limit(3).exec(function(err,data){
                        var itemObj = new Object();
                        itemObj.id = item.id;
                        itemObj.name = item.name;
                        itemObj.type = item.type;
                        itemObj.data = data||[];
                        itemArr.push(itemObj);
                        callback(err,itemArr);
                    });
                    break;
                case 4://热门推荐
                    var condition = {likesRate:{">":75}};
                    var sortArr = [{downloadCount:'DESC'}];
                    weeklyRanking.find(condition).sort(sortArr).limit(3).exec(function(err,data){
                        var itemObj = new Object();
                        itemObj.id = item.id;
                        itemObj.name = item.name;
                        itemObj.type = item.type;
                        itemObj.data = data||[];
                        itemArr.push(itemObj);
                        callback(err,itemArr);
                    });
                    break;
                case 5://游戏新品速递
                    var condition = {appType:'GAME'};
                    var sortArr = [{downloadCount:'ASC'}];
                    weeklyRanking.find({where:condition}).sort(sortArr).limit(3).exec(function(err,data){
                        var itemObj = new Object();
                        itemObj.id = item.id;
                        itemObj.name = item.name;
                        itemObj.type = item.type;
                        itemObj.data = data||[];
                        itemArr.push(itemObj);
                        callback(err,itemArr);
                    });
                    break;
                case 7://五星精品游戏
                    // var condition = {appType:'GAME',likesRate:{">":75}};
                    // var sortArr = [{downloadCount:'DESC'}];
                    // weeklyRanking.find({where:condition}).sort(sortArr).limit(3).exec(function(err,data){
                    //     var itemObj = new Object();
                    //     itemObj.id = item.id;
                    //     itemObj.name = item.name;
                    //     itemObj.type = item.type;
                    //     itemObj.data = data||[];
                    //     itemArr.push(itemObj);
                    //     callback(err,itemArr);
                    // });
                    var classifyId = dt.getAppsClassifyId('网络游戏');
                    var sqlQueryClassify = "select * from classify_" + classifyId + " where likesRate > 75 order by downloadCount desc limit 3";
                    selectFun(item,sqlQueryClassify,callback);
                    break;
                case 8://本周优质游戏
                    var condition = {appType:'GAME',likesRate:{">":75}};
                    var sortArr = [{downloadCount:'DESC'}];
                    weeklyRanking.find({where:condition}).sort(sortArr).limit(3).exec(function(err,data){
                        var itemObj = new Object();
                        itemObj.id = item.id;
                        itemObj.name = item.name;
                        itemObj.type = item.type;
                        // var result = data||[];
                        itemObj.data = data||[];
                        itemArr.push(itemObj);
                        callback(err,itemArr);
                    });
                    break;
                case 6://网游风云榜
                    var classifyId = dt.getAppsClassifyId('网络游戏');
                    var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit 3";
                    selectFun(item,sqlQueryClassify,callback);
                    break;
                case 9://休闲益智游戏
                    var classifyId = dt.getAppsClassifyId('休闲时间');
                    var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit 3";
                    selectFun(item,sqlQueryClassify,callback);
                    break;
                case 10://发现好音乐
                    var classifyId = dt.getAppsClassifyId('音乐');
                    var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit 3";
                    selectFun(item,sqlQueryClassify,callback);
                    break;
                case 11://玩滤镜,拍视频
                    var classifyId = dt.getAppsClassifyId('图像');
                    var sqlQueryClassify = "select * from classify_" + classifyId + " where likesRate > 80 order by downloadCount desc limit 3";
                    selectFun(item,sqlQueryClassify,callback);
                    break;
                case 12://年轻人的社交
                    var classifyId = dt.getAppsClassifyId('聊天社交');
                    var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit 3";
  
                    selectFun(item,sqlQueryClassify,callback);
                    break;
                case 13://看视频 追剧
                    var classifyId = dt.getAppsClassifyId('视频');
                    var sqlQueryClassify = "select * from classify_" + classifyId + " order by downloadCount desc limit 3";
                    selectFun(item,sqlQueryClassify,callback);
                    break;
            }
            if(item.id == 1){
                var sortArr = [{setTopTime:'DESC'},{orderId:'ASC'}];
                appDetails.find({where:{'unshelve':{'!=':1}}}).sort(sortArr).limit(3).exec(function(err,result){
                    if(err){
                        cback(err,result);
                    }
                    var itemObj = new Object();
                    itemObj.id = item.id;
                    itemObj.name = item.name;
                    itemObj.type = item.type;

                    var dataArr = [];
                    var arr2 = result;
                    if(arr2.length>0){
                        for(var k=0;k<arr2.length;k++){
                            var b = appDetails.dataFormat(arr2[k]);
                            dataArr.push(b);
                        }
                        itemObj.data = dataArr;
                    } else{
                        itemObj.data =[];
                    }
                    itemArr.push(itemObj);
                    callback(err,itemArr);
                });
            }
        },function(err, results){
            cbfun(err, results);
        });
        
        function selectFun(item,sqlStr,callback){
            console.log(sqlStr);
            sails.getDatastore('peas').sendNativeQuery(sqlStr, function(err, data){
                var itemArr2 = [];
                var itemObj = new Object();
                itemObj.id = item.id;
                itemObj.name = item.name;
                itemObj.type = item.type;
                var result = data.rows||[];
                itemObj.data = m.parseApps(result);
                itemArr2.push(itemObj);
                callback(err,itemArr2);
            });
        }
    }
};

