/**
 * Created by etapp on 15/4/28.
 */
var _ = require('underscore');
var Therapist = Parse.Object.extend('Therapist');

// Display all therapists
exports.index = function(req, res) {
    var query = new Parse.Query('Therapist');
    query.find().then(function(results){
        res.render('therapist/index', { therapists : results});
    },
    function() {
        res.send(500, 'Failed loading therapists');
    });
};

// Display a form for creating a new therapist
exports.new = function(req, res) {
    res.render('therapist/new', {});
};

// Create a new therapist
exports.create = function(req, res) {
    var therapist = new Therapist();

    therapist.save(_.pick(req.body, 'name', 'sex')).then(function() {
        res.redirect('/therapist');
    },
    function() {
        res.send(500, 'Failed saving therapist');
    });
};

// Display a form for editing a specified therapist.
exports.edit = function(req, res) {
    var query = new Parse.Query(Therapist);
    query.get(req.params.id).then(function(therapist) {
            if (therapist) {
                res.render('therapist/edit', {
                    therapist: therapist
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
    var therapist = new Therapist();
    therapist.id = req.params.id;
    therapist.save(_.pick(req.body, 'name', 'sex')).then(function() {
            res.redirect('/therapist');
        },
        function() {
            res.send(500, 'Failed saving therapist');
        });
};