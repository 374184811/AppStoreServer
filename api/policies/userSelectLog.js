/**
 * isLoggedIn
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how this policy works and how to use it, see:
 *   https://sailsjs.com/anatomy/api/policies/isLoggedIn.js
 */
module.exports = function uSelectLog(req, res, next) {
    var options = req.options||{action:'undefined/undefined'};
    var allParams = req.allParams();
    
    var actionArr = options.action.split('/');
    var insert = {};
    insert.phoneimei = allParams.imei||"";
    insert.controller = actionArr[0].toLowerCase();
    insert.action = actionArr[1].toLowerCase();
    insert.params = JSON.stringify(allParams||{}).replace(/\'/g,'\\\'');
    insert.createtime = new Date().format('yyyy-MM-dd hh:mm:ss');
    
    userSelectLog.createLog(insert,next);
};
