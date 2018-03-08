/**
 * isLoggedIn
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how this policy works and how to use it, see:
 *   https://sailsjs.com/anatomy/api/policies/isLoggedIn.js
 */
module.exports = function uSelectLog(req, res, next) {
    var tableName = "adsappstatistics" + ((new Date()).format("yyyy"));

    adsappstatistics.createTable(tableName,next);
};
