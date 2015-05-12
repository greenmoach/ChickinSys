/**
 * Created by etapp on 15/4/28.
 */

var _ = require('underscore');
var Patient = Parse.Object.extend('Patient');

// Display all patients
exports.index = function(req, res) {
    var query = new Parse.Query('Patient');
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

// Update a therapist based on patient id, name and sex etc..
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