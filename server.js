var express = require('express');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var app = express();

app.set('port', process.env.PORT || 5000);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

var connection = mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ballot');
autoIncrement.initialize(connection);

app.enable('trust proxy');

var ballotSchema = new Schema({
  question: String,
  answers: [Schema.Types.Mixed],
  voted: [Schema.Types.Mixed]
});
ballotSchema.plugin(autoIncrement.plugin, 'Ballot')
var Ballot = mongoose.model('Ballot', ballotSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/src'));



app.get('/', function(req, res) {
  res.render('hello.html');
});

app.post('/', function(req, res) {
  var question = req.body['question'];
  if (question.trim() === '') {
    return res.render('hello.html', {error: "Question cannot be blank."});
  }
  var answers_temp = req.body.answers;
  if (typeof req.body.answers === 'undefined') {
    return res.render('hello.html', {error: "Answer cannot be blank."})
  }
  var answers = {};
  for (var i = 0; i < answers_temp.length; ++i) {
    answers[answers_temp[i]] = 0;
  }
  console.log(answers);
  var b = new Ballot({question: question, answers: answers});

  b.save(function(err) {
    if (err) console.log(err);
    Ballot.findById(b, function(err, ballot) {
      res.redirect('/ballot/' + ballot['_id']);
    });
  });
});

app.get('/ballot/:id/', function(req, res) {
  var ballot = req.params.id;
  Ballot.findOne({_id: ballot}, function(err, ballot) {
    var users_who_have_voted = [];
    ballot['voted'].forEach(function(dict) {
      for (var key in dict) {
        users_who_have_voted.push(dict[key]);
      }
    });
    var voted = false;
    if (users_who_have_voted.indexOf(req.ip.toString()) > -1) {
      var voted_for = '';
      for (var x = 0; x < ballot['voted'].length; x++) {
        if (ballot['voted'][x]['ip'] === req.ip.toString()) {
          voted_for = ballot['voted'][x]['for'];
        }
      }
      return res.render('ballot.html', {ballot: ballot, voted: true, voted_for:  voted_for})
    };
    return res.render('ballot.html', {ballot: ballot, voted: false})
  });
});

app.get('/:id/vote/:index', function(req, res) {
  var ballot_id = req.params.id;
  var index = req.params.index;

  Ballot.findOne({_id: ballot_id}, function(err, ballot) {
    var users_who_have_voted = [];
    ballot['voted'].forEach(function(dict) {
      for (var key in dict) {
        users_who_have_voted.push(dict[key]);
      }
    })
    if (users_who_have_voted.indexOf(req.ip.toString()) > -1) {
      return res.redirect('/ballot/' + ballot['id']);
    } else {
      ballot['voted'].push({ip:req.ip.toString(), for: index});
    }
    var p = Object.keys(ballot.answers[0])[index];
    ballot['answers'][0][p] += 1;

    ballot.markModified('answers');

    ballot.save(function(err) {
      if (err) console.log(err);
      console.log(ballot);
      Ballot.findById(ballot, function(err, ballot) {
        res.redirect('/ballot/' + ballot['id']);
      });
    });
  });
});

app.listen(app.get('port'), function() {
  console.log("Listening on port "+app.get('port')+".");
});