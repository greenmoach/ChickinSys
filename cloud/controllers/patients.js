/**
 * Created by etapp on 15/4/28.
 */

var _ = require('underscore');
var Patient = Parse.Object.extend('Patient');

// Display all therapists
exports.index = function(req, res) {
    var query = new Parse.Query('Patient');
    query.find().then(function(results){
            res.render('patient/index', { patients : results});
        },
        function() {
            res.send(500, 'Failed loading patients');
        });
};

// Display a form for creating a new therapist
exports.new = function(req, res) {
    res.render('patient/new', {});
};

// Create a new therapist
exports.create = function(req, res) {
    var patient = new Patient();

    patient.save(_.pick(req.body, 'name', 'sex', 'kind', 'point', 'diagnosis')).then(function() {
            res.redirect('/patient');
        },
        function() {
            res.send(500, 'Failed saving therapist');
        });
};

// Display a form for editing a specified therapist.
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

// Update a therapist based on specified id, name and sex.
exports.update = function(req, res) {
    var patient = new Patient();
    patient.id = req.params.id;
    patient.save(_.pick(req.body, 'name', 'sex', 'kind', 'point', 'diagnosis')).then(function() {
            res.redirect('/patient');
        },
        function() {
            res.send(500, 'Failed saving therapist');
        });
};