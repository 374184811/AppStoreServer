
/**
 * ClassifyController.js
 *
 * @description :: 控制器定义，该控制器用于展示应用类别相关信息
 * @docs        :: 无
 */

module.exports = {

    /**
    * 豆子视图结构
    *
    * 这个函数用于获取豆子视图数据展示的结构，
    * 前段获取类别数据，用保持跟豆子视图结构
    * 展示一致。
    *
    * @return { 结果集 }
    */
    peasViewConfig: function(req, res) {

        console.log('peasVeiwConfig: This is the function entry. check it out: ', req.allParams());
        // if (!req.session.mine) {
        //     return res.json({
        //         code: 400,
        //         msg: "用户未登录"
        //     });
        // }
        
        var allParams = req.allParams();

        var map = new Map();

        //控制器检查
        map.set('OPTION_CHECK',OPTION_CHECK);

        //访问检查
        var acces = ck.isAccess(req,res,map);
        if (acces !== 200) return acces;

        async.auto({
            findParent: function (cb) {

                try {

                    appClassify.find({parentId:0}).exec(function (err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                        cb(err,list);
                    });

                } catch (e) {
                    console.log('findParent: err. ', e);
                }
            },

            findSub: function (cb) {

                try {

                    appClassify.find({ parentId: {'>': 0 } }).exec(function (err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                        cb(err,list);
                    });

                } catch (e) {
                    console.log('findSub: err. ', e);
                }
            },

        }, function (err, results) {
            //console.log('results. ',results);
            if (results) {

                //校验结果
                results = results || {};
                results.findSub = results.findSub || [];
                results.findParent = results.findParent || [];
                results.peasConfig = results.peasConfig || [];

                var err = null;
                var subArray = results.findSub || [];
                var parentArray = results.findParent || [];

                var i,j,k,classifyArray;
                for(i = 0; i<parentArray.length; i++) {

                    var p = parentArray[i];
                    var config = {};

                    config.id = p.id;
                    config.icon =  p.icon;
                    config.type =  p.type;
                    config.name =  p.name;
                    config.alias =  p.alias;
                    config.weight =  p.weight;
                    config.banner =  p.banner;
                    config.intent =  p.intent;
                    config.slogan =  p.slogan;
                    config.parentId =  p.parentId;
                    config.thumbnail =  p.thumbnail;
                    config.groupName =  p.groupName;
                    config.relatedIds =  p.relatedIds;
                    config.inactiveIcon =  p.inactiveIcon;
                    config.defaultAppCount =  p.defaultAppCount;

                    config.categoryName = {};
                    config.categoryName.name = p.name;
                    config.categoryName.level = p.level;
                    config.categoryName.alias = p.alias;
                    config.categoryName.type = p.themetype;

                    config.subCategories = [];

                    for(j = 0; j<subArray.length; j++) {

                        var e = subArray[j];

                        var pid = p.id;
                        var eid = e.parentId;
                        if (_.isEqual(eid,pid)) {

                            var subConfig = {};

                            subConfig.id = e.id;
                            subConfig.icon =  e.icon;
                            subConfig.type =  e.type;
                            subConfig.name =  e.name;
                            subConfig.alias =  e.alias;
                            subConfig.weight =  e.weight;
                            subConfig.banner =  e.banner;
                            subConfig.intent =  e.intent;
                            subConfig.slogan =  e.slogan;
                            subConfig.parentId =  e.parentId;
                            subConfig.thumbnail =  e.thumbnail;
                            subConfig.groupName =  e.groupName;
                            subConfig.relatedIds =  e.relatedIds;
                            subConfig.inactiveIcon =  e.inactiveIcon;
                            subConfig.defaultAppCount =  e.defaultAppCount;

                            subConfig.categoryName = {};
                            subConfig.categoryName.name = e.name;
                            subConfig.categoryName.level = e.level;
                            subConfig.categoryName.alias = e.alias;
                            subConfig.categoryName.type = e.themetype;

                            config.subCategories.push(subConfig);
                        }
                    }

                    classifyArray = classifyArray || [];
                    classifyArray.push(config);
                }

                //豆子数据
                var peasArray = classifyArray;

                //返回数据
                return res.json({
                    data: peasArray,
                    code: 200,
                    msg: "分类结构"
                });
            }
        });
    },

    /**
    * 应用列表
    *
    * 这个函数用于获取豆子分类应用列表，用于
    * 获取分类下的应用列表。
    *
    * @return { 结果集 }
    */
    peasTopList: function (req, res) {

        console.log('peasTopList: This is the function entry. check it out: ', req.allParams());

        var allParams = req.allParams();

        var map = new Map();

        //控制器检查
        map.set('OPTION_CHECK',OPTION_CHECK);

        //访问检查
        var acces = ck.isAccess(req,res,map);
        if (acces !== 200) return acces;

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

        if (classifyId === -1) {
            async.parallel({

                a: function(cb) {

                    appDetails.find({sort:'downloadCount DESC'}).exec(function(err,list){
                        if (err) return;
                        console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                        cb(err,list);
                    })
                },

                b: function(cb) {

                    var sqlQueryClassify = "select * from weeklyranking order by downloadCount desc limit " + nextPage + ", " + max;
                    console.log('sqlQueryClassify. check it out. ',sqlQueryClassify);
                    weeklyRanking.getDatastore().sendNativeQuery(sqlQueryClassify, function(err, r){
                        if (err) return;
                        console.log('cb_tag2: The result of this query is shown came out. check it out:  ',r.rows.length);
                        cb(err,r.rows);
                    });
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


                    var secondApp ,fifthApp;

                    var idx = start * maxPage + i;
                    if (!parseInt(idx)&&results.a[idx]) {
                        secondApp = results.a[idx];
                    }else{

                        secondApp = results.a[m.changeIndex(idx)];
                        fifthApp = results.a[m.changeNextIdx(idx+1)];
                    }

                    console.log('start',start,' max. ',max, ' curpage. ',idx);

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
                    msg: "周榜数据"
                });
            });
        }else{

            async.parallel({

                a: function(cb) {

                    appDetails.find({sort:'downloadCount DESC'}).exec(function(err,list){
                        if (err) return;
                        console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                        cb(err,list);
                    })
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
                },
            }, function (err, results) {

                results = results || {};
                results.a = results.a || [];
                results.b = results.b || [];
                results.a = m.getApps(results.a);
                results.a = m.sortApps(results.a);
                results.b = m.parseApps(results.b);
                results.b = m.filtersApp(results.b);

                results.b[0] = results.b[0] || {};
                results.b[0].apps = results.b[0].apps || [];
                //console.log('length. check it out. ',results.b[0].apps.length);

                var i,j;
                var index,list,maxPage;
                
                list = list || utils.clone(results.b[0].apps);
                //console.log('list.length. check it out. ',list.length);

                maxPage = parseInt(list.length/5) + (list.length%5>0 ? 1 : 0);
                //console.log('maxPage. check it out. ',maxPage);

                var listItem = [];
                for(i = 0; i<maxPage; i++) {
                    var _start = i * 5;
                    var _max = (i + 1) * 5
                    var _list = list.slice(_start,_max);
                    //console.log('_list. check it out. ',_list.length);


                    var secondApp ,fifthApp;

                    var idx = start * maxPage + i;
                    if (!parseInt(idx)&&results.a[idx]) {
                        secondApp = results.a[idx];
                    }else{

                        secondApp = results.a[m.changeIndex(idx)];
                        fifthApp = results.a[m.changeNextIdx(idx+1)];
                    }

                    console.log('start',start,' max. ',max, ' curpage. ',idx);

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


                results.b[0].apps = m.changeApps(listItem);
                return res.json({
                    data: results.b,
                    code: 200,
                    msg: "分类数据"
                });
            });
        }
        
    },

    /**
    * 全部应用
    *
    * 这个函数用于获取豆子全部应用类别数视图
    *
    * @return { 结果集 }
    */
    peasAppsList: function(req, res) {

        console.log('peasAppsList: This is the function entry. check it out: ', req.allParams());

        var allParams = req.allParams();

        var map = new Map();

        //控制器检查
        map.set('OPTION_CHECK',OPTION_CHECK);

        //访问检查
        var acces = ck.isAccess(req,res,map);
        if (acces !== 200) return acces;

        async.auto({
            findParent: function (cb) {

                try {

                    appClassify.find({parentId:0,type:'APP'}).exec(function (err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                        cb(err,list);
                    });

                } catch (e) {
                    console.log('findParent: err. ', e);
                }
            },

            findSub: function (cb) {

                try {

                    appClassify.find({ type: 'APP' }).exec(function (err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                        cb(err,list);
                    });

                } catch (e) {
                    console.log('findSub: err. ', e);
                }
            },

        }, function (err, results) {
            //console.log('results. ',results);
            if (results) {

                //校验结果
                results = results || {};
                results.findSub = results.findSub || [];
                results.findParent = results.findParent || [];
                results.peasConfig = results.peasConfig || [];

                var err = null;
                var subArray = results.findSub || [];
                var parentArray = results.findParent || [];

                var i,j,k,classifyArray;
                for(i = 0; i<parentArray.length; i++) {

                    var p = parentArray[i];
                    var config = {};

                    config.id = p.id;
                    config.icon =  p.icon;
                    config.type =  p.type;
                    config.name =  p.name;
                    config.alias =  p.alias;
                    config.weight =  p.weight;
                    config.banner =  p.banner;
                    config.intent =  p.intent;
                    config.slogan =  p.slogan;
                    config.parentId =  p.parentId;
                    config.thumbnail =  p.thumbnail;
                    config.groupName =  p.groupName;
                    config.relatedIds =  p.relatedIds;
                    config.inactiveIcon =  p.inactiveIcon;
                    config.defaultAppCount =  p.defaultAppCount;

                    config.categoryName = {};
                    config.categoryName.name = p.name;
                    config.categoryName.level = p.level;
                    config.categoryName.alias = p.alias;
                    config.categoryName.type = p.themetype;

                    config.subCategories = [];

                    for(j = 0; j<subArray.length; j++) {

                        var e = subArray[j];

                        var pid = p.id;
                        var eid = e.parentId;
                        if (_.isEqual(eid,pid)) {

                            var subConfig = {};

                            subConfig.id = e.id;
                            subConfig.icon =  e.icon;
                            subConfig.type =  e.type;
                            subConfig.name =  e.name;
                            subConfig.alias =  e.alias;
                            subConfig.weight =  e.weight;
                            subConfig.banner =  e.banner;
                            subConfig.intent =  e.intent;
                            subConfig.slogan =  e.slogan;
                            subConfig.parentId =  e.parentId;
                            subConfig.thumbnail =  e.thumbnail;
                            subConfig.groupName =  e.groupName;
                            subConfig.relatedIds =  e.relatedIds;
                            subConfig.inactiveIcon =  e.inactiveIcon;
                            subConfig.defaultAppCount =  e.defaultAppCount;

                            subConfig.categoryName = {};
                            subConfig.categoryName.name = e.name;
                            subConfig.categoryName.level = e.level;
                            subConfig.categoryName.alias = e.alias;
                            subConfig.categoryName.type = e.themetype;

                            config.subCategories.push(subConfig);
                        }
                    }

                    classifyArray = classifyArray || [];
                    classifyArray.push(config);
                }

                //豆子数据
                var peasArray = classifyArray;

                //返回数据
                return res.json({
                    data: peasArray,
                    code: 200,
                    msg: "全部应用"
                });
            }
        });
    },

    /**
    * 全部游戏
    *
    * 这个函数用于获取豆子全部游戏类别数视图
    *
    * @return { 结果集 }
    */
    peasGameList: function(req, res) {

        console.log('peasGameList: This is the function entry. check it out: ', req.allParams());

        var allParams = req.allParams();

        var map = new Map();

        //控制器检查
        map.set('OPTION_CHECK',OPTION_CHECK);

        //访问检查
        var acces = ck.isAccess(req,res,map);
        if (acces !== 200) return acces;

        async.auto({
            findParent: function (cb) {

                try {

                    appClassify.find({parentId:0,type:'GAME'}).exec(function (err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                        cb(err,list);
                    });

                } catch (e) {
                    console.log('findParent: err. ', e);
                }
            },

            findSub: function (cb) {

                try {

                    appClassify.find({ type: 'GAME' }).exec(function (err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
                        cb(err,list);
                    });

                } catch (e) {
                    console.log('findSub: err. ', e);
                }
            },

        }, function (err, results) {
            //console.log('results. ',results);
            if (results) {

                //校验结果
                results = results || {};
                results.findSub = results.findSub || [];
                results.findParent = results.findParent || [];
                results.peasConfig = results.peasConfig || [];

                var err = null;
                var subArray = results.findSub || [];
                var parentArray = results.findParent || [];

                var i,j,k,classifyArray;
                for(i = 0; i<parentArray.length; i++) {

                    var p = parentArray[i];
                    var config = {};

                    config.id = p.id;
                    config.icon =  p.icon;
                    config.type =  p.type;
                    config.name =  p.name;
                    config.alias =  p.alias;
                    config.weight =  p.weight;
                    config.banner =  p.banner;
                    config.intent =  p.intent;
                    config.slogan =  p.slogan;
                    config.parentId =  p.parentId;
                    config.thumbnail =  p.thumbnail;
                    config.groupName =  p.groupName;
                    config.relatedIds =  p.relatedIds;
                    config.inactiveIcon =  p.inactiveIcon;
                    config.defaultAppCount =  p.defaultAppCount;

                    config.categoryName = {};
                    config.categoryName.name = p.name;
                    config.categoryName.level = p.level;
                    config.categoryName.alias = p.alias;
                    config.categoryName.type = p.themetype;

                    config.subCategories = [];

                    for(j = 0; j<subArray.length; j++) {

                        var e = subArray[j];

                        var pid = p.id;
                        var eid = e.parentId;
                        if (_.isEqual(eid,pid)) {

                            var subConfig = {};

                            subConfig.id = e.id;
                            subConfig.icon =  e.icon;
                            subConfig.type =  e.type;
                            subConfig.name =  e.name;
                            subConfig.alias =  e.alias;
                            subConfig.weight =  e.weight;
                            subConfig.banner =  e.banner;
                            subConfig.intent =  e.intent;
                            subConfig.slogan =  e.slogan;
                            subConfig.parentId =  e.parentId;
                            subConfig.thumbnail =  e.thumbnail;
                            subConfig.groupName =  e.groupName;
                            subConfig.relatedIds =  e.relatedIds;
                            subConfig.inactiveIcon =  e.inactiveIcon;
                            subConfig.defaultAppCount =  e.defaultAppCount;

                            subConfig.categoryName = {};
                            subConfig.categoryName.name = e.name;
                            subConfig.categoryName.level = e.level;
                            subConfig.categoryName.alias = e.alias;
                            subConfig.categoryName.type = e.themetype;

                            config.subCategories.push(subConfig);
                        }
                    }

                    classifyArray = classifyArray || [];
                    classifyArray.push(config);
                }

                //豆子数据
                var peasArray = classifyArray;

                //返回数据
                return res.json({
                    data: peasArray,
                    code: 200,
                    msg: "全部游戏"
                });
            }
        });
    },


};
