/**
 * Kun's test
 *
 * @description :: APIs for the navigation bar to load data.
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */

var mysql = require("sails-mysql");
//var Passwords = require('machinepack-passwords');
var crypto = require("crypto");
var http = require('http');
var fs = require("fs");

 module.exports = {
 	
 	allApptest:function(req, res){

 	//console.log('allApptest: This is the function entry. check it out: ', req.allParams());
        var timestamp = (new Date()).getTime();
        var nondata = "baoqianli"+"cfe71f1f06424bb186571b2414656815"+ timestamp;

        var hash = crypto.createHash('md5');
        hash.update(nondata);
        var token = hash.digest('hex');
	    //console.log(token);
        //console.log(timestamp);

		var options = { 
		hostname: 'api.wandoujia.com', 
		port: 80, 
		path: '/v1/categories', 
		method: 'GET' 
		}; 

		var req = http.request(options, function(response) { 
                        var body = ""; 
			console.log('STATUS: ' + response.statusCode); 
			console.log('HEADERS: ' + JSON.stringify(response.headers)); 
			response.setEncoding('utf8'); 
			response.on('data', function (chunk) { 
                        body += chunk;
			//console.log('BODY: ' + chunk); 
                        //console.log(body);
                        return res.json(body);
			}); 
			//res.end(){}
		}); 

		req.on('error', function(e) { 
		console.log('problem with request: ' + e.message); 
		}); 

		// write data to request body 
		req.write('data\n'); 
		//req.write(body); 
		req.end();
        //return res.json(400);
 	},
    /**
     * 载数据入数据库接口
     * @param req
     * @param res
     */    
    allApps:function(req, res){

        var timestamp = (new Date()).getTime();
        var nondata = "baoqianli"+"cfe71f1f06424bb186571b2414656815"+ timestamp;
        var hash = crypto.createHash('md5');
        hash.update(nondata);
        var token = hash.digest('hex');

        var page = [1,2];
        page.forEach(function(value, index){ 

            var param = '?id=baoqianli&token='+token+'&timestamp='+timestamp+'&page='+value+'&phone_imei=869515027741260';

            http.get("http://api.wandoujia.com/v1/allApps.json"+param, function(response) {

                var size = 0;
                var chunks = [];
                response.on('data', function(chunk){
                        size += chunk.length;
                        chunks.push(chunk);
                });
                response.on('end', function(){
                        var data = Buffer.concat(chunks, size);
                        var json = JSON.parse(data.toString());
                        //console.log(data.toString());
                        //console.log(json.apps.length);
                        var arr = new Array();

                        for(var i = 0; i < json.apps.length; i++){
                            var app = {
                                packageName: json.apps[i].packageName,
                                appType: json.apps[i].appType||"",
                                categories: JSON.stringify(json.apps[i].categories||""),
                                tag: json.apps[i].tags[0].tag,
                                bytes: json.apps[i].apks[0].bytes,
                                downloadCount: json.apps[i].downloadCount,
                                installedCount: json.apps[i].installedCount,
                                versionName: json.apps[i].apks[0].versionName,
                                title: json.apps[i].title,
                                likesRate: json.apps[i].likesRate,
                                changelog: json.apps[i].changelog,
                                description: json.apps[i].description,
                                icons: json.apps[i].icons,
                                screenshots: json.apps[i].screenshots,
                                downloadUrl: json.apps[i].apks[0].downloadUrl.url,
                                md5: json.apps[i].apks[0].md5,
                                versionCode: json.apps[i].apks[0].versionCode,
                                permissions: JSON.stringify(json.apps[i].apks[0].permissions||""),
                                developer: json.apps[i].developer.name,
                                tagline: json.apps[i].tagline||"", 
                                unshelve: "0",
                                unshelveTime: "0",
                                setTop: "0",
                                setTopTime: "0",
                                class1: "",
                                class2: "",
                                orderId: 0,
                                createdAt: new Date(json.apps[i].publishDate).format("yyyy-MM-dd hh:mm:ss"),
                                updatedAt: new Date(json.apps[i].updatedDate).format("yyyy-MM-dd hh:mm:ss")
                            };
                            if (json.apps[i].categories.length == 1||json.apps[i].categories.length == 2) 
                                app.class1 = json.apps[i].categories[0].name;
                            if (json.apps[i].categories.length == 2) 
                                app.class2 = json.apps[i].categories[1].name;
                            arr.push(app);
                        }
                        //console.log(arr);
                        appDetails.createEach(arr).meta({fetch: true}).exec(function (err, record) {
                            console.log("Now u get to fill in a table...");
                            if (err) return res.negotiate(err);
                            // if (record) {
                            //     console.log(record.length + " Data loaded!");
                            //     //_this.Userlog(req, account, "user");
                            //     // return res.json({
                            //     //     "success": true,
                            //     //     "msgCode": 200,
                            //     //     "msg": "success",
                            //     //     "result": record
                            //     // });
                            // } else {
                            //     return res.json({
                            //         "success": false,
                            //         "msgCode": 400,
                            //         "msg": "false",
                            //         "result": {}
                            //     });
                            // }
                        });
                    });
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });           
        });
        return res.json(400);
    }, 	
    /**
     * 周日更新接口
     * @param req
     * @param res
     */
    weeklyUpdate:function(req,res){
        var queryStr1 = 'UPDATE appdetails SET setTop = "0", setTopTime = "0" WHERE setTop = "2"';
        var queryStr2 = 'SELECT * FROM appdetails ORDER BY setTopTime DESC, downloadCount DESC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            //console.log(data.rows.length);
            appDetails.getDatastore().sendNativeQuery(queryStr2, function(err, data){
            if (err) return res.negotiate(err);
                //create order index for the current list
                indexArr = _.keys(data.rows);
                indexArr.forEach(function(value,index){
                    appDetails.update({id: data.rows[value].id}).set({orderId: index+1}).exec(function (err) {
                        if (err)  return res.negotiate(err);

                        if (index==data.rows.length-1){ 
                            return res.json({
                                code: 200,
                                msg: "Gotcha!",
                                //result: data.rows
                            });                  
                         } 
                         if (!data) {
                            return res.json({
                                code: 400,
                                msg: "Not Found",
                                result: {}
                            });
                        } 
                    });
                });      
            });
        });
    },
    /**
     * 顺序接口
     * @param req
     * @param res
     */
    createOrder:function(req,res){
        var queryStr = 'SELECT * FROM appdetails ORDER BY setTopTime DESC';
        appDetails.getDatastore().sendNativeQuery(queryStr1, function(err, data){
            if (err) return res.negotiate(err);
            //console.log(data.rows.length);
            //create order index for the current list
            indexArr = _.keys(data.rows);
            indexArr.forEach(function(value,index){
                appDetails.update({id: data.rows[value].id}).set({orderId: index+1}).exec(function (err) {
                    if (err)  return res.negotiate(err);

                    if (index==data.rows.length-1){ 
                        return res.json({
                            code: 200,
                            msg: "Order Creadted!",
                            //result: data.rows
                        });                  
                     } 
                     if (!data) {
                        return res.json({
                            code: 400,
                            msg: "Not Found",
                            result: {}
                        });
                    } 
                });
            });      
        });
    }, 
    /**
     * 读取全量数据库接口
     * @param req
     * @param res
     */
    loadApps:function(req,res){
        console.log('loadApps. session. ',req.session);
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var queryStr = 'SELECT * FROM appdetails WHERE unshelve != "1" ORDER BY setTopTime DESC, orderId ASC';
        appDetails.getDatastore().sendNativeQuery(queryStr, function(err, data){
            if (err) return res.negotiate(err);
            //console.log(data.rows.length);
            //create order index for the current list
            // indexArr = _.keys(data.rows);
            // indexArr.forEach(function(value,index){
            //     appDetails.update({id: data.rows[value].id}).set({orderId: index+1}).exec(function (err) {
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
            //     });
            // });        
        });
    },	
    /**
     * 读取1级分类数据库接口
     * @param req
     * @param res
     * @param class1
     */
    loadbyClass1:function(req,res){
        console.log('loadbyClass1: This is the function entry. check it out: ', req.allParams());
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var category1 = req.param("class1", false);

        var queryStr = 'SELECT * FROM appdetails WHERE unshelve != "1" AND class1 ="'+ category1 +
        '" ORDER BY setTopTime DESC, orderId ASC';
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
     * 读取2级分类数据库接口
     * @param req
     * @param res
     * @param class1
     * @param class2
     */
    loadbyClass2:function(req,res){
        console.log('loadbyClass2: This is the function entry. check it out: ', req.allParams());
        if (!req.session.mine) {
            return res.json({
                code: 403,
                msg: "用户未登录"
            });
        }

        var category1 = req.param("class1", false);
        var category2 = req.param("class2", false);

        var queryStr = 'SELECT * FROM appdetails WHERE unshelve != "1" AND class2 ="'+ category2 +
        '" AND class1 ="'+ category1 +'" ORDER BY setTopTime DESC, orderId ASC';
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
};
