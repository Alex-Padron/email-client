var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('mongoose');

var add_authentication = require('./routes/authentication.js');
var add_pages = require('./routes/pages.js');

console.log("MONGODB CONNECT:", process.env.MONGODB_URI
		 || 'mongodb://localhost/student-email-client');
mongoose.connect(process.env.MONGODB_URI
		 || 'mongodb://localhost/student-email-client');

var db = mongoose.connection;
db.once('error', function(err) {
  console.log("MongoDB Connection Error", err);
});

var app = express();
app.use(body_parser.json());

//allow the app to render html
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//serve static public files
app.use(express.static(__dirname + '/public'));


db.once('open', function() {
  var user_data = require("./js/user-data.js")();
  //handle login/sessions
  add_authentication(app, user_data);
  add_pages(app, user_data);
});

app.listen(process.env.PORT || 3000, function() {
  console.log("LISTENING PORT", process.env.PORT || 3000);
});
