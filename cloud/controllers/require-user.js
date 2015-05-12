/**
 * Created by etapp on 15/5/12.
 */
// Use this middleware to require that a user is logged in
module.exports = function(req, res, next) {
    if (Parse.User.current()) {
        console.log(Parse.User.current());
        next();
    } else {
        console.log(Parse.User.current());
        res.render('home/login', { flash: '請先登入' });
    }
}