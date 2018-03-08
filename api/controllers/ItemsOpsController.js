/**
 *
 *
 * @description :: Items Manipulation controllers which can delete, unshelve and set to top/删除，下架，置顶
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */

 module.exports = {
    /**
     * 应用删除接口
     * @param req
     * @param res
     * @param id array, [1,2,3]
     */
    delete:function(req,res){
      
        console.log('delete: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = req.param("id", false);

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        appDetails.destroy({id: {in:JSON.parse(id)}}).exec(function (err, record) {
            if (err)  return res.negotiate(err);

            return res.json({
                code: 200,
                msg: "删除成功！"
            });
        });
    },
    /**
     * 下架应用接口
     * @param req
     * @param res
     * @param id array, [1,2,3]
     */
    unshelve:function(req,res){
        console.log('unshelve: This is the function entry. check it out: ', req.allParams());
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = JSON.parse(req.param("id", false));

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        id.forEach(function(value, index){ 
            //console.log(value);
            appDetails.update({id: value}).set({unshelve:"1", unshelveTime:(new Date()).getTime()}).exec(function (err) {
                if (err)  return res.negotiate(err);
                if (index==id.length-1){
                    return res.json({
                        code: 200,
                        msg: "下架成功！"
                    });
                }
            });
        });
    },
    /**
     * 下架应用列表接口
     * @param req
     * @param res
     */
    unshelveList:function(req,res){
        console.log('unshelveList: This is the function entry. check it out: ', req.allParams());
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var queryStr = 'SELECT * FROM appdetails WHERE unshelve = "1"';

        appDetails.getDatastore().sendNativeQuery(queryStr, function(err, data){
            if (err) return res.negotiate(err);
            //console.log(data.rows.length);
            if(data){ 
                return res.json({
                    code: 200,
                    msg: "Gotcha!",
                    result: data.rows
                });                  
            } else {
                return res.json({
                    code: 400,
                    msg: "Not Found",
                    result: {}
                });
            }          
        });
    },
    /**
     * 下架应用恢复接口
     * @param req
     * @param res
     * @param id
     * @param unshelveTime
     */
    unshelveRecover:function(req,res){
        console.log('unshelveRecover: This is the function entry. check it out: ', req.allParams());
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = req.param("id", false);
        var unshelveTime = req.param("unshelveTime", false);

        if (!id||!unshelveTime) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        //find difference of one week:
        var oneweek = new Date("Thu Jun 29 2017 09:04:37 GMT+0800").getTime()
                    - new Date("Thu Jun 22 2017 09:04:37 GMT+0800").getTime();
        //console.log(oneweek);
        var today = new Date().getTime();

        var queryStr = 'SELECT * FROM appdetails WHERE unshelve != "1" order by setTopTime DESC, orderId ASC';
        if ((today - unshelveTime >= oneweek)||(new Date().getDay() < new Date(Number(unshelveTime)).getDay())){
            appDetails.update({id: id})
            .set({unshelve:"0", unshelveTime:"0", setTop:"2", setTopTime:(new Date()).getTime()}).exec(function (err) {
                if (err)  return res.negotiate(err);
                appDetails.getDatastore().sendNativeQuery(queryStr, function(err, data){
                    if (err) return res.negotiate(err);
                    //console.log(data.rows.length);
                    //create order index for the current list
                    indexArr = _.keys(data.rows);
                    indexArr.forEach(function(value,index){
                        appDetails.update({id: data.rows[value].id}).set({orderId: index+1}).exec(function (err) {
                            if (err)  return res.negotiate(err);
                        });
                    });

                    if(data){ 
                        return res.json({
                            code: 200,
                            msg: "下架恢复成功！",
                            //result: data.rows
                        });                  
                    } else {
                        return res.json({
                            code: 400,
                            msg: "Not Found",
                            result: {}
                        });
                    }          
                });
            });
        }else{      
            appDetails.update({id: id}).set({unshelve:"0", unshelveTime:"0"}).exec(function (err) {
                if (err)  return res.negotiate(err);
                return res.json({
                    code: 200,
                    msg: "下架恢复成功！"
                });
            });
        }
    },
    /**
     * 单应用置顶接口
     * @param req
     * @param res
     * @param id
     */
    setTop:function(req,res){
      
        console.log('setTop: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = req.param("id", false);

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        appDetails.update({id: id}).set({setTopTime:(new Date()).getTime(), setTop:"1"}).exec(function (err) {
            if (err)  return res.negotiate(err);

            var queryStr = 'SELECT * FROM appdetails order by setTopTime DESC, orderId ASC';
            appDetails.getDatastore().sendNativeQuery(queryStr, function(err, data){
                if (err) return res.negotiate(err);
                //console.log(data.rows.length);
                //create order index for the current list
                // indexArr = _.keys(data.rows);
                // indexArr.forEach(function(value,index){
                //     appDetails.update({id: data.rows[value].id}).set({orderId: index+1}).exec(function (err) {
                //         if (err)  return res.negotiate(err);
                //     });
                // });

                if(data){ 
                    return res.json({
                        code: 200,
                        msg: "置顶成功！",
                        //result: data.rows
                    });                  
                } else {
                    return res.json({
                        code: 400,
                        msg: "Not Found",
                        result: {}
                    });
                }          
            });
        });
    },
    /**
     * 单应用取消置顶接口
     * @param req
     * @param res
     * @param id
     */
    cancelTop:function(req,res){
      
        console.log('cancelTop: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = req.param("id", false);

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        appDetails.update({id: id}).set({setTopTime:"0", setTop:"0"}).exec(function (err) {
            if (err)  return res.negotiate(err);

            var queryStr = 'SELECT * FROM appdetails order by setTopTime DESC, orderId ASC';
            appDetails.getDatastore().sendNativeQuery(queryStr, function(err, data){
                if (err) return res.negotiate(err);
                //console.log(data.rows.length);
                //create order index for the current list
                // indexArr = _.keys(data.rows);
                // indexArr.forEach(function(value,index){
                //     appDetails.update({id: data.rows[value].id}).set({orderId: index+1}).exec(function (err) {
                //         if (err)  return res.negotiate(err);
                //     });
                // });

                if(data){ 
                    return res.json({
                        code: 200,
                        msg: "取消置顶成功！",
                        //result: data.rows
                    });                  
                } else {
                    return res.json({
                        code: 400,
                        msg: "Not Found",
                        result: {}
                    });
                }          
            });
        });
    },
    /**
     * 多应用置顶接口
     * @param req
     * @param res
     * @param id array, [1,2,3]
     */
    setTops:function(req,res){
      
        console.log('setTops: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = JSON.parse(req.param("id", false));

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }
        var time = (new Date()).getTime();
        id.forEach(function(value,index){        
            appDetails.update({id: value, setTop:{'!=':'1'}})
            .set({setTopTime: time + (id.length - index)*1, setTop:"1"}).exec(function (err) {
                if (err)  return res.negotiate(err);
                console.log(time+ (id.length - index)*1);
                if(index==id.length-1){ 
                    return res.json({
                        code: 200,
                        msg: "置顶成功！",
                    });                  
                }          
            });
        });
    },
    /**
     * 多应用取消置顶接口
     * @param req
     * @param res
     * @param id array, [1,2,3]
     */
    cancelTops:function(req,res){
      
        console.log('cancelTops: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = JSON.parse(req.param("id", false));

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        id.forEach(function(value,index){
            appDetails.update({id: value, setTop:"1"}).set({setTopTime:"0", setTop:"0"}).exec(function (err) {
                if (err)  return res.negotiate(err);

                var queryStr = 'SELECT * FROM appdetails order by setTopTime DESC, orderId ASC';
                appDetails.getDatastore().sendNativeQuery(queryStr, function(err, data){
                    if (err) return res.negotiate(err);
                    //console.log(data.rows.length);
                    //create order index for the current list
                    // indexArr = _.keys(data.rows);
                    // indexArr.forEach(function(value,index){
                    //     appDetails.update({id: data.rows[value].id}).set({orderId: index+1}).exec(function (err) {
                    //         if (err)  return res.negotiate(err);
                    //     });
                    // });

                    if(index==id.length-1){ 
                        return res.json({
                            code: 200,
                            msg: "取消置顶成功！",
                            //result: data.rows
                        });                  
                    }          
                });

            });
        });
    },
    /**
     * 全量应用上移一位接口
     * @param req
     * @param res
     * @param id array, [1,2]
     */
    shiftUp:function(req,res){      
        console.log('shiftUp: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = JSON.parse(req.param("id", false));//Given two neighbor ids

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        var queryStr1 = 'UPDATE appdetails SET orderId = orderId -1 WHERE id = '+ id[0];
        var queryStr2 = 'UPDATE appdetails SET orderId = orderId +1 WHERE id = '+ id[1];
        var queryStr3 = 'SELECT * FROM appdetails WHERE unshelve != "1" ORDER BY orderId ASC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
                if (err) return res.negotiate(err);
                appDetails.getDatastore().sendNativeQuery(queryStr3, function(err, data){
                    if (err) return res.negotiate(err);
                    //console.log(data.rows.length);
                    return res.json({
                        code: 200,
                        msg: "上移成功！",
                        //result: data.rows
                    });                          
                });                       
            });        
        });
    },
    /**
     * 全量应用下移一位接口
     * @param req
     * @param res
     * @param id array, [1,2]
     */
    shiftDown:function(req,res){      
        console.log('shiftDown: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id = JSON.parse(req.param("id", false));//Given two neighbor ids

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        var queryStr1 = 'UPDATE appdetails SET orderId = orderId +1 WHERE id = '+ id[0];
        var queryStr2 = 'UPDATE appdetails SET orderId = orderId -1 WHERE id = '+ id[1];
        var queryStr3 = 'SELECT * FROM appdetails WHERE unshelve != "1" ORDER BY orderId ASC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
                if (err) return res.negotiate(err);
                appDetails.getDatastore().sendNativeQuery(queryStr3, function(err, data){
                    if (err) return res.negotiate(err);
                    //console.log(data.rows.length);
                    return res.json({
                        code: 200,
                        msg: "下移成功！",
                        //result: data.rows
                    });                          
                });                       
            });        
        });
    },
    /**
     * 应用移动一位接口
     * @param req
     * @param res
     * @param id1, id2, orderId1, orderId2
     */
    shift:function(req,res){      
        console.log('shift: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id1 = req.param("id1", false);//current object
        var id2 = req.param("id2", false);//target object
        var orderId1 = req.param("orderId1", false);
        var orderId2 = req.param("orderId2", false);

        if (!id1||!id2) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        var queryStr1 = 'UPDATE appdetails SET orderId = "'+ orderId2 +'" WHERE id = '+ id1;
        var queryStr2 = 'UPDATE appdetails SET orderId = "'+ orderId1 +'" WHERE id = '+ id2;
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
                if (err) return res.negotiate(err);
                return res.json({
                    code: 200,
                    msg: "移动成功！",
                });                                                 
            });        
        });
    },
    /**
     * 1级分类应用移动一位接口
     * @param req
     * @param res
     * @param id1, id2, orderId1, orderId2, class1
     */
    shiftClass1:function(req,res){      
        console.log('shiftClass1: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id1 = req.param("id1", false);//current object
        var id2 = req.param("id2", false);//target object
        var orderId1 = req.param("orderId1", false);
        var orderId2 = req.param("orderId2", false);
        var class1 = req.param("class1", false);

        if (!class1) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数class1必须有！",
                "result": {}
            });
        }

        var queryStr1 = 'UPDATE appdetails SET orderId = "'+ orderId2 +'" WHERE id = '+ id1;
        var queryStr2 = 'UPDATE appdetails SET orderId = "'+ orderId1 +'" WHERE id = '+ id2;
        var queryStr3 = 'SELECT * FROM appdetails WHERE class1 ="'+ class1 +'" AND unshelve != "1" ORDER BY orderId ASC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
                if (err) return res.negotiate(err);
                appDetails.getDatastore().sendNativeQuery(queryStr3, function(err, data){
                    if (err) return res.negotiate(err);
                    //console.log(data.rows.length);
                    return res.json({
                        code: 200,
                        msg: "移动成功！",
                        //result: data.rows
                    });                          
                });                       
            });        
        });
    },
    /**
     * 2级分类应用移动一位接口
     * @param req
     * @param res
     * @param id1, id2, orderId1, orderId2, class2
     */
    shiftClass2:function(req,res){      
        console.log('shiftClass2: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id1 = req.param("id1", false);//current object
        var id2 = req.param("id2", false);//target object
        var orderId1 = req.param("orderId1", false);
        var orderId2 = req.param("orderId2", false);
        var class2 = req.param("class2", false);

        if (!class2) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数class2必须有！",
                "result": {}
            });
        }

        var queryStr1 = 'UPDATE appdetails SET orderId = "'+ orderId2 +'" WHERE id = '+ id1;
        var queryStr2 = 'UPDATE appdetails SET orderId = "'+ orderId1 +'" WHERE id = '+ id2;
        var queryStr3 = 'SELECT * FROM appdetails WHERE class2 ="'+ class2 +'" AND unshelve != "1" ORDER BY orderId ASC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
                if (err) return res.negotiate(err);
                appDetails.getDatastore().sendNativeQuery(queryStr3, function(err, data){
                    if (err) return res.negotiate(err);
                    //console.log(data.rows.length);
                    return res.json({
                        code: 200,
                        msg: "移动成功！",
                        //result: data.rows
                    });                          
                });                       
            });        
        });
    },
    /**
     * 全量置顶应用移动接口
     * @param req
     * @param res
     * @param id1, id2, setTopTime1, setTopTime2, 
     */
    setTopShift:function(req,res){      
        console.log('setTopShift: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id1 = req.param("id1", false);//current object
        var id2 = req.param("id2", false);//target object
        var setTopTime1 = req.param("setTopTime1", false);
        var setTopTime2 = req.param("setTopTime2", false);


        if (!id1||!id2) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }
        //if (setTopTime1 == setTopTime2) setTopTime1 += 1;
        var queryStr1 = 'UPDATE appdetails SET setTopTime = "'+ setTopTime2 +'" WHERE id = '+ id1;
        var queryStr2 = 'UPDATE appdetails SET setTopTime = "'+ setTopTime1 +'" WHERE id = '+ id2;
        //var queryStr3 = 'SELECT * FROM appdetails WHERE unshelve != "1" ORDER BY orderId ASC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
                if (err) return res.negotiate(err);
                //appDetails.getDatastore().sendNativeQuery(queryStr3, function(err, data){
                    //if (err) return res.negotiate(err);
                    return res.json({
                        code: 200,
                        msg: "移动成功！",
                        //result: data.rows
                    });                          
               //});                       
            });        
        });
    },
    /**
     * 1级置顶应用移动接口
     * @param req
     * @param res
     * @param id1, id2, setTopTime1, setTopTime2, class1
     */
    setTopShiftClass1:function(req,res){      
        console.log('setTopShiftClass1: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id1 = req.param("id1", false);//current object
        var id2 = req.param("id2", false);//target object
        var setTopTime1 = req.param("setTopTime1", false);
        var setTopTime2 = req.param("setTopTime2", false);
        var class1 = req.param("class1", false);

        if (!class1) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数class1必须有！",
                "result": {}
            });
        }

        var queryStr1 = 'UPDATE appdetails SET setTopTime = "'+ setTopTime2 +'" WHERE id = '+ id1;
        var queryStr2 = 'UPDATE appdetails SET setTopTime = "'+ setTopTime1 +'" WHERE id = '+ id2;
        var queryStr3 = 'SELECT * FROM appdetails WHERE class1 ="'+ class1 +'" AND unshelve != "1" ORDER BY orderId ASC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
                if (err) return res.negotiate(err);
                appDetails.getDatastore().sendNativeQuery(queryStr3, function(err, data){
                    if (err) return res.negotiate(err);
                    //console.log(data.rows.length);
                    return res.json({
                        code: 200,
                        msg: "移动成功！",
                        //result: data.rows
                    });                          
                });                       
            });        
        });
    },
    /**
     * 2级置顶应用移动接口
     * @param req
     * @param res
     * @param id1, id2, setTopTime1, setTopTime2, class2
     */
    setTopShiftClass2:function(req,res){      
        console.log('setTopShiftClass2: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var id1 = req.param("id1", false);//current object
        var id2 = req.param("id2", false);//target object
        var setTopTime1 = req.param("setTopTime1", false);
        var setTopTime2 = req.param("setTopTime2", false);
        var class2 = req.param("class2", false);

        if (!class2) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数class2必须有！",
                "result": {}
            });
        }

        var queryStr1 = 'UPDATE appdetails SET setTopTime = "'+ setTopTime2 +'" WHERE id = '+ id1;
        var queryStr2 = 'UPDATE appdetails SET setTopTime = "'+ setTopTime1 +'" WHERE id = '+ id2;
        var queryStr3 = 'SELECT * FROM appdetails WHERE class2 ="'+ class2 +'" AND unshelve != "1" ORDER BY orderId ASC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
                if (err) return res.negotiate(err);
                appDetails.getDatastore().sendNativeQuery(queryStr3, function(err, data){
                    if (err) return res.negotiate(err);
                    //console.log(data.rows.length);
                    return res.json({
                        code: 200,
                        msg: "移动成功！",
                        //result: data.rows
                    });                          
                });                       
            });        
        });
    },
    /**
     * 载入活动图标接口
     * @param req
     * @param res
     * @param icon1,icon2,icon3,icon4,icon5
     */
    iconLoad:function(req,res){      
        console.log('iconLoad: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var icon1 = req.param("icon1", false);
        var icon2 = req.param("icon2", false);
        var icon3 = req.param("icon3", false);
        var icon4 = req.param("icon4", false);
        var icon5 = req.param("icon5", false);
        var icons = [];
        var num = [1, 2, 3, 4, 5];
        num.forEach(function(value,index){
            topic.find({id:index+1}).exec(function (err,record) {

                if(err) return res.negotiate(err);
                if(!record){              
                    return res.json({
                         code:400,
                         msg:"没找到！",
                         result:{}
                    });
                }
                            
                icons.push(record);
                if((index == num.length-1)&(icons.length==5)){                 
                    return res.json({
                    code:200,
                    msg:"保存成功！",
                    result:icons
                    });   
                }               
            });
        });
    }, 
    /**
     * 更换活动图标接口
     * @param req
     * @param res
     * @param icon1,icon2,icon3,icon4,icon5
     */
    iconChange:function(req,res){      
        console.log('iconChange: This is the function entry. check it out: ', req.allParams()); 
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var icon1 = req.param("icon1", false);
        var icon2 = req.param("icon2", false);
        var icon3 = req.param("icon3", false);
        var icon4 = req.param("icon4", false);
        var icon5 = req.param("icon5", false);
        var icons = [icon1, icon2, icon3, icon4, icon5];

        icons.forEach(function(value,index){
            topic.update({id:index+1}).set({icon:value}).meta({fetch: true}).exec(function (err,record) {

                if(err) return res.negotiate(err);
                if(!record){              
                    return res.json({
                         code:400,
                         msg:"没找到！",
                         result:{}
                    });
                }
                if(index == record.length-1){              
                    return res.json({
                         code:200,
                         msg:"保存成功！",
                    });
                }
            });
        });    
    }, 
    /**
     * asyc单应用置顶接口
     * @param req
     * @param res
     * @param id
     */
    setTopTest:function(req,res){
      
        console.log('setTopTest: This is the function entry. check it out: ', req.allParams()); 
        // if (!req.session.mine) {
        //     return res.json({
        //         code: 403,
        //         msg: "用户未登录"
        //     });
        // }

        var id = req.param("id", false);

        if (!id) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数id必须有！",
                "result": {}
            });
        }

        async.auto({
            one: function(callback){
                appDetails.update({id: id})
                .set({setTopTime:(new Date()).getTime(), setTop:"1"}).meta({fetch: true}).exec(callback);
                // callback(null,'one');
            },
            two: ['one', function(results1, callback){
                var queryStr = 'SELECT * FROM appdetails order by setTopTime DESC, orderId ASC';
                appDetails.getDatastore().sendNativeQuery(queryStr, callback);
                // callback(null,'two');
            }],
            three: ['two', function(results2, callback){
                //console.log(results.two.rows);
                // var Redata=[];
                // indexArr = _.keys(results2.two.rows);
                // indexArr.forEach(function(value,index){
                //     appDetails.update({id: results2.two.rows[value].id}).set({orderId: index+1})
                //     .meta({fetch: true}).exec(function(err,data){
                //         Redata.push(data);
                //         if (indexArr.length == index + 1)
                //             callback(err,Redata);
                //     });
                // }); 
                var i = 0;
                async.mapSeries(results2.two.rows,function(item,cb){
                    appDetails.update({id: item.id}).set({orderId: ++i})
                    .meta({fetch: true}).exec(function(err,data){
                        cb(err,data);
                    });
                },function(err,result3){
                    callback(err,result3);
                });
                //callback(null,'three'); 
            }],
        }, function(err,results){
            if (err) return res.negotiate(err);
            if(results){ 
                return res.json({
                    code: 200,
                    msg: "置顶成功！",
                    result: results.three
                });
            }                  
        });               
    },
};