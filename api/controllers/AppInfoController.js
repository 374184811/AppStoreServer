/**
 * AppInfoController
 *
 * @description :: Server-side logic for managing appinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    /**
     * 检测app版本
     * AppInfo/checkVersion
     * @param version string app版本
     * @param platform string app平台
     *
     */
    checkVersion: function (req, res) {
        console.log(req.ip,req.path,req.allParams());
        
        var curVersion = req.param("version", 0);
        var platform = req.param("platform", false);
        var channel = req.param("channel", false);
        
        if (platform == false) {
            return res.json({
                code: 400,
                msg: "平台不能为空"
            });
        }

        var condition = {platform: platform, version: {">": curVersion}};

        appinfo.find(condition).sort('version DESC').exec(function (err, info) {
            if (err) {
                console.log(err);
                return;
            }
            //console.log(info);
            if (info.length>0) {
                return res.json({
                    code: 200,
                    data: info
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "你的app是最新版本"
                });
            }
        });
    }
};

