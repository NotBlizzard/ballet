var express = require('express');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Schema = mongoose.Schema;
var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

mongoose.connect('mongodb://localhost/ballot');

var ballotSchema = new Schema({
  question: String,
  answers: [String]
});
var Ballot = mongoose.model('Ballet', ballotSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/build'));


app.get('/', function(req, res) {
  res.render('hello.html');
});

app.post('/', function(req, res) {
  var question = req.body['question'];
  var answers = req.body['answers'];
  var b = new Ballot({question: question, answers: answers});
  b.save(function(err) {
    if (err) console.log(err);
    console.log('saved');
    Ballot.findById(b, function(err, ballot) {
      res.redirect('/' + ballot['id'].toString().substr(5));
    });
  });
});

app.get('/:id', function(req, res) {
  var ballot = req.params.id;
  Ballot.findOne({'_id': ballot}, function(err, ballot) {
    console.log(ballot);
    res.render('ballot.html', {ballot: ballot})
  });
});

app.listen(3000, function() {
  console.log("Listening on port 3000.");
});