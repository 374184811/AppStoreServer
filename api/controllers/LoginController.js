/**
 *
 *
 * @description :: admin login controller/登录
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */
var grabAll = require('./GrabAllController');
 module.exports = {
    /**
     * 应用登录接口
     * @param req
     * @param res
     * @param username
     * @param password
     */
    login:function(req,res){
      
        console.log('login: This is the function entry. check it out: ', req.allParams()); 
        var userName = req.param("username", false);
        var pwd = req.param("password", false);
        //console.log(userName + "|" + pwd);

        if (!userName || !pwd) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }

        admin.findOne({username: userName}).exec(function (err, account) {
            if (err) return res.negotiate(err);
            //console.log(account);
            if (account == undefined) {
              return res.json({
                "success": false,
                "msgCode": 412,
                "msg": "用户不存在",
                "result": {}
              });

            } else if (account.password != pwd) {
              return res.json({
                "success": false,
                "msgCode": 417,
                "msg": "密码错误",
                "result": {}
              });

            } else {
                //userLogin(serverResult, account,0);
                //weekly update add here if possible

                admin.update({username: userName}).set({updatedAt:(new Date()).getTime()}).exec(function (err, record) {
                  if (err)  return res.negotiate(err);
                });

                req.session.mine = req.session.mine || {};
                req.session.mine.userId = account.id;
                req.session.mine.userName = account.username;
                //console.log('req.session.login. ',req.session.mine.userId);
                return res.json({
                      "success": true,
                      "msgCode": 200,
                      "msg": "登录成功",
                      "result": {
                          'userName': req.session.mine.userName,
                          'currentTime': new Date().format("yyyy-MM-dd hh:mm:ss"),
                      }
                });
            }
        });
    },
    /**
     * 应用登录退出接口
     * @param req
     * @param res
     */
    logout:function(req,res){
      console.log('logout: This is the function entry. check it out: ', req.allParams());
      req.session.mine = null;
      console.log("===============================logout==============================");

      return res.json({
            code: 200,
            msg: "退出登录成功!",
            session: req.session.mine
      });
    },
    /**
     * 伪周日更新接口
     * @param req
     * @param res
     */
    weeklyLogin:function(req,res){
      var oneweek = new Date("Thu Jun 29 2017 09:04:37 GMT+0800").getTime()
                  - new Date("Thu Jun 22 2017 09:04:37 GMT+0800").getTime();
      var today = new Date().getTime();
      if ((today - account.updatedAt >= oneweek)||(new Date().getDay() < new Date(Number(account.updatedAt)).getDay())){
        grabAll.createOrder();
      }
    }

};