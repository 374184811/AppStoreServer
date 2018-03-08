/**
 * Kun's test
 *
 * @description :: Server-side API requests.
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */

var mysql = require("sails-mysql");
//var Passwords = require('machinepack-passwords');
var crypto = require("crypto");
var http = require('http');
var fs = require("fs");

 module.exports = {

    createLog:function(req, res){

        var memory = {};
        memory.packageName = req.param("packageName", false);
        memory.updatedAt = (new Date()).format("yyyy-MM-dd hh:mm:ss");
        memory.createdAt = (new Date()).format("yyyy-MM-dd hh:mm:ss");

        appHistory.createTest(memory,function (err, l){
            console.log('cb_tag1: The result of this createLog is shown came out. check it out:  ok');
        });
    },

    getApkMsg:function(req, res){
        var filepath = "https://dstoreres.darlinglive.com/apks/26c2efab-f15d-4759-953b-1705f683902d.apk"; 

        common.getAppMsg(filepath, function(data){ 
                var code = data.versionCode;
                console.log(code);
        //return res.json(data.versionCode);

        //return res.json(400);
        });
    },

 	thirdPartyAPI:function(req, res){

 		//console.log('updateCGoods: This is the function entry. check it out: ', req.allParams());

        //var mine = req.session.mine;
        //var allParams = req.allParams();
        // allParams.name = allParams.name || 'fuck';
        // if (allParams.name !== 'xian') {
        //     return res.json({
        //         code:200,
        //         data:[],
        //         msg:'fuck ass!!!!!!'
        //     });
        // }

        //var map = new Map();

        //登录检查
        //map.set('MINE_CHECK',MINE_CHECK);
        //参数检查
        //map.set('PASS_CHECK',PASS_CHECK);
        //空对象检查
        //map.set('VALID_CHECK',VALID_CHECK);
        //管理员检查
        //map.set('ADMIND_CHECK',ADMIND_CHECK);

        //访问检查
        // var acces = gcom.isAccess(req,res,map)
        // if (acces !== 200) return acces;

        var timestamp = (new Date()).getTime();
        var nondata = "baoqianli"+"cfe71f1f06424bb186571b2414656815"+ timestamp;
        //var sqlQueryParent = 'select id from goodscategory where parentid = 0 ';
        var hash = crypto.createHash('md5');
        hash.update(nondata);
        var token = hash.digest('hex');
	console.log(token);
        console.log(timestamp);

        //console.log('sqlQueryParent: check it out: ',sqlQueryParent);

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
                        //console.log(body);
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
        
        thirdPartyAPI1:function(req, res){
                http.get("http://api.wandoujia.com/v1/allApps.json", function(res) {
                var size = 0;
                var chunks = [];
                res.on('data', function(chunk){
                size += chunk.length;
                chunks.push(chunk);
                //console.log(chunk);
                //return res.json(chunk);
                });
                res.on('end', function(){
                var data = Buffer.concat(chunks, size);
                console.log(data.toString())
                });console.log(res);
                }).on('error', function(e) {
                console.log("Got error: " + e.message);
                });

                return res.json(400);

        },
 		
};
