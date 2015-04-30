/**
 * Created by etapp on 15/4/29.
 */

var _ = require('underscore');

var Therapist = Parse.Object.extend('Therapist');
var Patient = Parse.Object.extend('Patient');
var Schedule = Parse.Object.extend('Schedule');

exports.show = function(req, res) {
    var weeks = ['Mon','Tue','Wed','Thu','Fri','Sat'];
    var periods = [{key:'08300900',value:'08:30 - 09:00 (上午八點半到九點)'}, {key:'09000930',value:'09:00 - 09:30 (上午九點到九點半)'},
        {key:'09301000',value:'09:30 - 10:00 (上午九點半到十點)'}, {key:'10001030',value:'10:00 - 10:30 (上午十點到十點半)'},
        {key:'10301100',value:'10:30 - 11:00 (上午十點半到十一點)'}, {key:'11001130',value:'11:00 - 11:30 (上午十一點到十一點半)'},
        {key:'13301400',value:'13:30 - 14:00 (下午一點半到兩點)'}, {key:'14001430',value:'14:00 - 14:30 (下午兩點到兩點半)'},
        {key:'14301500',value:'14:30 - 15:00 (下午兩點半到三點)'}, {key:'15001530',value:'15:00 - 15:30 (下午三點到三點半)'},
        {key:'15301600',value:'15:30 - 16:00 (下午三點半到四點)'}, {key:'16001630',value:'16:00 - 16:30 (下午四點到四點半)'},
        {key:'17301800',value:'17:30 - 18:00 (晚上五點半到六點)'}, {key:'18001830',value:'18:00 - 18:30 (晚上六點到六點半)'},
        {key:'18301900',value:'18:30 - 19:00 (晚上六點半到七點)'}, {key:'19001930',value:'19:00 - 19:30 (晚上七點到七點半)'},
        {key:'19302000',value:'19:30 - 20:00 (晚上七點半到八點)'}, {key:'20002030',value:'20:00 - 20:30 (晚上八點到八點半)'},
        {key:'20302100',value:'20:30 - 21:00 (晚上八點半到九點)'}];

    var model = [];
    var query = new Parse.Query(Schedule);
    query.equalTo('TherapistId', req.params.id);
    query.find({
        success: function(schedules) {
        var pq  = new Parse.Query(Patient);
            pq.find().then(function(patients) {
            console.log('=======patients========' + patients.length);
            for(var i = 0; i < weeks.length; i++) {
                var perArr = [];
                for(var j = 0; j < periods.length; j++) {
                    var match = _.filter(schedules, function(item){
                        console.log('===MATCH===' + _.values(schedules[0]) + '===='+weeks[i]+'=====');
                        return item.get('Day') == weeks[i] && item.get('Period') == periods[j].key;
                    });

                    var patsArr = [];
                    _.each(match, function(item){
                        var patient = _.find(patients, function(pa){
                            return pa.id == item.get('PatientId');
                        });
                        patsArr.push(patient);
                    });
                    perArr.push({period: periods[j].key, desc: periods[j].value, patients: patsArr});
                }
                model.push({Day:weeks[i], periods: perArr});
            }
                res.json(model);
        });
        },
        error: function(error) {
            console.log(error.message);
            res.send(500, error.message);
        }

    });


//    res.render('schedule/show',{ therapistId : req.params.id });
};

exports.assign = function(req, res) {
    res.render('schedule/assign',{ therapistId : req.params.id });
}

exports.schedules = function(req, res) {
    try {
        var query = new Parse.Query(Schedule);
        if(typeof(query) !== 'undefined') {
            query.equalTo('TherapistId', req.params.id);
            query.find({
                success: function(schedules) {
                    var query  = new Parse.Query(Patient);
                    query.find().then(function(patiens) {
                        res.json({sch: schedules, pa: patiens});

                    });
                },
                error: function(error) {
                    console.log(error.message);
                    res.send(500, error.message);
                }

            });
        }
    } catch (ex) {
        console.error(ex.message);
    }


};

exports.update = function(req, res) {
    var query = new Parse.Query(Schedule);
    if(typeof(query) !== 'undefined') {
        query.equalTo('TherapistId', req.params.id);
        query.find().then(function(results) {
                deleteRecursive(results, 0, function() {
                    _.each(req.body, function(obj){
                        var schedule = new Schedule();
                        schedule.save(obj, {
                            success: function(gameScore) {
                                // The object was saved successfully.
                            },
                            error: function(gameScore, error) {
                                // The save failed.
                                // error is a Parse.Error with an error code and message.
                            }
                        });
                    });
                    console.log('=========UPDATE DONE=======');
                    res.json({'code':200,'msg':'Update success'});
                });
            },
            function() {
                res.json({'code':500,'msg':'Failed finding schedules for therapist'});

            });
    }else {

    }
};

// Initial call should be deleteRecursive(objects, 0, function() {...});
// Invokes callback after all items in objects are deleted.
// Only works if number of objects is small (to avoid Cloud Code timeout).
var deleteRecursive = function(objects, index, callback) {
    if (index >= objects.length) {
        callback();
    } else {
        objects[index].destroy().then(function() {
            deleteRecursive(objects, index + 1, callback);
        });
    }
}