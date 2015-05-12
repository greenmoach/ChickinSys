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
                    query.equalTo("day", day_list[today.getDay()]);
                    query.equalTo("therapistId", 'OYnzMphxij');
                    query.find().then(function(jobs) {
                        var dailyJobs = [];
                        var pq  = new Parse.Query(Patient);
                        pq.find().then(function(patients) {
                            _.each(jobs, function(job){
                                var patient =_.find(patients, function(pa){
                                    return pa.id == job.get('patientId');
                                });
                                dailyJobs.push({ job: job, pa: patient });
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
                query.equalTo("day", day_list[today.getDay()]);
                query.equalTo("therapistId", 'OYnzMphxij');
                query.find().then(function(jobs) {
                    var dailyJobs = [];
                    var pq  = new Parse.Query(Patient);
                    pq.find().then(function(patients) {
                        _.each(jobs, function(job){
                            var patient =_.find(patients, function(pa){
                                return pa.id == job.get('patientId');
                            });
                            dailyJobs.push({ job: job, pa: patient });
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
}

exports.loginAction = function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
        res.redirect('/');
    }, function(error) {
        // Show the error message and let the user try again
        res.render('home/login', {username: req.body.username, flash: error.message });
    });
}

var GenJobs = function(callback) {
    var query = new Parse.Query(Schedule);
    query.find().then(function(schedules) {
            var query  = new Parse.Query(Patient);
            query.find().then(function(patiens) {
                    _.each(schedules, function(sche) {
                        var fPat = _.find(patiens, function(pat){
                            return sche.get('patientId') == pat.id;
                        });
                        var dailyJob = new DailyJob();
                        dailyJob.set("patientId",sche.get('patientId'));
                        dailyJob.set("therapistId",sche.get('therapistId'));
                        dailyJob.set("day",sche.get('day'));
                        dailyJob.set("period",sche.get('period'));
                        dailyJob.set("kind",fPat.get('kind'));
                        dailyJob.set("division",fPat.get('division'));
                        dailyJob.set("insurancePoint",fPat.get('insurancePoint'));
                        dailyJob.set("innerPoint",fPat.get('innerPoint'));
                        dailyJob.set("status","Line");


                        dailyJob.save(null, {
                            success: function(dailyJob) {
                            },
                            error: function(dailyJob, error) {
                                callback.error(error);
                            }
                        });
                    });
                    callback.success();
                },
                function(error) {
                    callback.error(error);
                });
        },
        function(error) {
            callback.error(error);
        });
}