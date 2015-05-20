/**
 * Created by etapp on 15/5/4.
 */

var _ = require('underscore');
var moment = require('cloud/libs/moment')
var Therapist = Parse.Object.extend('Therapist');
var Patient = Parse.Object.extend('Patient');
var Schedule = Parse.Object.extend('Schedule');
var DailyJob= Parse.Object.extend('DailyJob');

exports.index = function(req, res) {
    res.render('home/index', { });
};

exports.jobs = function(req, res) {
    var day_list = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var today = new Date();
    today.setHours(0,0,0,0)
    var query = new Parse.Query("DailyJob");
    query.greaterThan("createdAt",today);
    query.find().then(function( models ){
            if (models.length == 0) {
                GenJobs({ success: function(){
                    query.equalTo("therapist", Parse.User.current());
                    query.find().then(function(jobs) {
                        var patQuery = new Parse.Query(Patient);
                        patQuery.find().then(function(pats){
                            var dailyJobs = [];
                            _.each(jobs, function(job){
                                var findPat = _.find(pats, function(num){
                                    return num.id == job.get('patient').id
                                });
                                dailyJobs.push({ job: job, pa: findPat });
                            });
                            res.json(dailyJobs);
                        });
                    });
                },
                    error: function(error) {
                        res.send(500, error.message)
                    }});
            }
            else {
                query.equalTo("therapist", Parse.User.current());
                query.find().then(function(jobs) {
                    var patQuery = new Parse.Query(Patient);
                    patQuery.find().then(function(pats){
                        var dailyJobs = [];
                        _.each(jobs, function(job){
                            var findPat = _.find(pats, function(num){
                                return num.id == job.get('patient').id
                            });
                            dailyJobs.push({ job: job, pa: findPat });
                        });
                        res.json(dailyJobs);
                    });
                });
            }
        },
        function( error ){
            res.send(500, error.message );
        });
};

exports.check = function(req, res) {
    var query = new Parse.Query(DailyJob);
    query.get(req.params.id, {
        success: function(dailyJob) {
            dailyJob.set('status', req.params.status);
            dailyJob.save(null, {
                success: function(dailyJob) {
                    res.json(dailyJob);
                }
            });
        },
        error: function(object, error) {
            res.send(500, error.message);
        }
    });
};


/**********  Identity ************/
exports.register  = function(req, res) {
    res.render('home/register', { });
}

exports.signup = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;
    if (passwordConfirm != password) {
        res.render('home/register', {username: username, flash: '兩次密碼輸入不同' });
    }else {
        var user = new Parse.User();
        user.set('username', username);
        user.set('password', password);

        user.signUp().then(function(user) {
            res.redirect('/');
        }, function(error) {
            // Show the error message and let the user try again
            res.render('home/register', {username: username, flash: error.message });
        });
    }
};

exports.login = function(req, res) {
    res.render('home/login', { });
};

exports.loginAction = function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
        res.redirect('/');

    }, function(error) {
        // Show the error message and let the user try again
        res.render('home/login', {username: req.body.username, flash: error.message });
    });
};

exports.logout = function(req, res) {
    Parse.User.logOut();
    res.render('home/login', { });
};

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

var GenJobs = function(callback) {
    var day_list = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var today = new Date();
    console.log('=======' + day_list[today.addHours(8).getDay()]);
    var query  = new Parse.Query(Patient);
    query.find().then(function(patiens) {
        _.each(patiens, function(pat) {
            if ( typeof (pat.get('day')) != 'undefined' && _.contains(pat.get('day').split(','), day_list[today.getDay()])) {
                var dailyJob = new DailyJob();
                dailyJob.set("patient", pat);
                dailyJob.set("therapist", pat.get('therapist'));
                dailyJob.set("day", pat.get('day'));
                dailyJob.set("period", pat.get('period'));
                dailyJob.set("kind", pat.get('kind'));
                dailyJob.set("division", pat.get('division'));
                dailyJob.set("insurancePoint", pat.get('insurancePoint'));
                dailyJob.set("innerPoint", pat.get('innerPoint'));
                dailyJob.set("status", "Line");

                dailyJob.save(null, {
                    success: function (dailyJob) {
                    },
                    error: function (dailyJob, error) {
                        callback.error(error);
                    }
                });
            }
        });
        callback.success();
    },
        function(error) {
            callback.error(error);
        });

}