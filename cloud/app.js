// These two lines are required to initialize Express in Cloud Code.
 express = require('express');
var moment = require('moment');
var _ = require('underscore');
 app = express();


// Controller code in separate files.
var therapistController = require('cloud/controllers/therapists.js');
var patientController = require('cloud/controllers/patients.js');


// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
app.use(express.methodOverride());

// You can use app.locals to store helper methods so that they are accessible
// from templates.
app.locals._ = _;
app.locals.formatTime = function(time) {
    return moment(time).format('MMMM Do YYYY, h:mm a');
};

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your apps!' });
});

app.get('/index', function(req, res){
    res.render('pages/index');
});


// RESTful routes for the blog post object.
app.get('/therapist', therapistController.index);
app.get('/therapist/new', therapistController.new);
app.post('/therapists', therapistController.create);
app.get('/therapists/:id/edit', therapistController.edit);
app.put('/therapists/:id', therapistController.update);

app.get('/patient', patientController.index);
app.get('/patient/new', patientController.new);
app.post('/patients', patientController.create);
app.get('/patients/:id/edit', patientController.edit);
app.put('/patients/:id', patientController.update);



// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
