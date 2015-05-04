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
    var today = new Date();
    today.setHours(0,0,0,0)
    var query = new Parse.Query("DailyJob");
    query.greaterThan("createdAt",today);
    query.find().then(function( models ){
            if (models.length == 0) {
                GenJobs({ success: function(){
                    query.equalTo("therapistId", 'JHhMj3tLEf')
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
                query.equalTo("therapistId", 'JHhMj3tLEf')
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
        }
    );

};

var GenJobs = function(callback) {
    var query = new Parse.Query(Schedule);
    query.find().then(function(schedules) {
            var query  = new Parse.Query(Patient);
            query.find().then(function(patiens) {
                    _.each(schedules, function(sche) {
                        var fPat = _.find(patiens, function(pat){
                            return sche.get('PatientId') == pat.id;
                        });
                        var dailyJob = new DailyJob();
                        dailyJob.set("patientId",sche.get('PatientId'));
                        dailyJob.set("therapistId",sche.get('TherapistId'));
                        dailyJob.set("day",sche.get('Day'));
                        dailyJob.set("period",sche.get('Period'));
                        dailyJob.set("kind",fPat.get('kind'));
                        dailyJob.set("point",fPat.get('point'));
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