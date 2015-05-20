/**
 * Created by etapp on 15/4/28.
 */

var _ = require('underscore');
var Patient = Parse.Object.extend('Patient');

// Display all patients
exports.index = function(req, res) {
    var query = new Parse.Query('Patient');
    query.equalTo('therapist', Parse.User.current());
    query.find().then(function(results){
            res.render('patient/index', { patients : results});
        },
        function() {
            res.send(500, 'Failed loading patients');
        });
};

// Display a form for creating a new patient
exports.new = function(req, res) {
    res.render('patient/new', {});
};

// Create a new patient
exports.create = function(req, res) {
    var patient = new Patient();
    patient.set('therapist', Parse.User.current());
    patient.save(_.pick(req.body, 'name', 'sex','bDay', 'chartNo', 'division','kind', 'insurancePoint', 'innerPoint', 'diagnosis', 'day', 'period', 'firstDate')).then(function() {
            res.redirect('/patient');
        },
        function(error) {
            res.send(500, 'Failed saving patient: ' + error.message);
        });
};

// Display a form for editing a specified patient.
exports.edit = function(req, res) {
    var query = new Parse.Query(Patient);
    query.get(req.params.id).then(function(patient) {
            if (patient) {
                res.render('patient/edit', {
                    patient: patient
                })
            } else {
                res.send('specified therapist does not exist')
            }
        },
        function() {
            res.send(500, 'Failed finding therapist to edit');
        });
};

// Update a patient based on patient id, name and sex etc..
exports.update = function(req, res) {
    var patient = new Patient();
    patient.id = req.params.id;
    patient.save(_.pick(req.body, 'name', 'sex','bDay', 'chartNo', 'division','kind', 'insurancePoint', 'innerPoint', 'diagnosis', 'day', 'period', 'firstDate')).then(function() {
            res.redirect('/patient');
        },
        function() {
            res.send(500, 'Failed saving therapist');
        });
};


exports.manager = function(req, res) {
    res.render('patient/manager', {});
};

exports.owns = function(req, res) {
    var query = new Parse.Query('Patient');
    query.equalTo('therapist', Parse.User.current());
    query.find().then(function(results){
            res.json(results);
        },
        function() {
            res.send(500, 'Failed loading patients');
        });
};

exports.unassigned = function(req, res) {
    var query = new Parse.Query('Patient');
    query.equalTo('therapist', null);
    query.find().then(function(results){
            res.json(results);
        },
        function() {
            res.send(500, 'Failed loading patients');
        });
};

exports.add = function(req, res) {
    var query = new Parse.Query('Patient');
    query.get(req.params.id, {
        success: function(patient) {
            // The object was retrieved successfully.
            patient.set('therapist', Parse.User.current());
            patient.save(null).then(function() {
                    res.send(200);
                },
                function(error) {
                    res.send(500, 'Failed add patient: ' + error.message);
                });
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            res.send(500, 'Failed fetch patient: ' + error.message);
        }
    });

};

exports.remove = function(req, res) {
    var query = new Parse.Query('Patient');
    query.get(req.params.id, {
        success: function(patient) {
            // The object was retrieved successfully.
            patient.set('therapist', null);
            patient.save(null).then(function() {
                    res.send(200);
                },
                function(error) {
                    res.send(500, 'Failed add patient: ' + error.message);
                });
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            res.send(500, 'Failed fetch patient: ' + error.message);
        }
    });
};

exports.delete = function(req, res) {
    var patient = new Patient();
    patient.id = req.params.id;

    patient.destroy().then(function() {
        res.send(200, 'Success deleting patient');
    },
    function() {
        res.send(500, 'Failed deleting patient');
    });
};