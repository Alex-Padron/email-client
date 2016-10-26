var mongoose = require("mongoose");

var Personal_info = require("./personal_info.js");
var Classes = require("./classes.js");
var Emails = require("./emails.js");
var Persister = require("./persist.js");

var User_data = function() {
  var that = Object.create(null);
  var users = {}
  var persister = undefined;

  // store db of client personal info
  var db_init = function() {
    var schema = mongoose.Schema({
      "username": String,
      "password": String,
      "email_address": String,
      "email_password": String,
      "classes": String,
      "emails": String
    });
    var model = mongoose.model("users", schema);
    persister = Persister(model);
  }

  var db_save = function(username) {
    persister.remove({"username": username}, function() {
      var user = users[username];
      persister.persist({
	"username": username,
	"password": user.personal_info.get_password(),
	"email_address": user.personal_info.get_email_address(),
	"email_password": user.personal_info.get_email_password(),
	"classes": user.classes.get_json_string(),
	"emails": user.emails.get_json_string()
      }, function() {
	console.log("SAVED STATE, USER", username);
      });
    });
  }

  var db_load = function() {
    persister.load(function(err, loaded_users) {
      loaded_users.forEach(function(user) {
	console.log("LOADED RECORD OF USER", user.username);
	users[user.username] = {
	  "personal_info": Personal_info(user.password,
					 user.email_address,
					 user.email_password),
	  "classes": Classes(),
	  "emails": Emails()
	};
	users[user.username].classes.parse_json_string(user.classes);
	users[user.username].emails.parse_json_string(user.emails);
      });
      console.log("LOADED USER STATE");
    });
  }

  // perform initial load on startup
  db_init();
  db_load();

  // return true if new user created successfully otherwise false if present
  that.add_user = function(username, password, email_address, email_password) {
    if (users[username]) return false;
    users[username] = {
      'personal_info': Personal_info(password, email_address, email_password),
      'classes': Classes(),
      'emails': Emails(),
    };
    db_save(username);
    return true;
  }

  that.add_email_to_send = function(username, email_name, subject, text) {
    var result = users[username].emails.add(email_name, subject, text);
    db_save(username);
    return result;
  }

  that.update_email_to_send = function(username, email_name, subject, text) {
    var result = users[username].emails.update(email_name, subject, text);
    db_save(username);
    return result;
  }

  that.remove_email_to_send = function(username, email_name) {
    users[username].emails.remove(email_name);
    db_save(username);
  }

  that.get_email_to_send = function(username, email_name) {
    return users[username].emails.get(email_name);
  }

  that.get_emails_list = function(username) {
    return users[username].emails.get_names();
  }

  that.contains_user = function(username) {
    return username in users;
  }

  that.password = function(username) {
    if (!users[username]) return undefined;
    return users[username].personal_info.get_password();
  }

  that.email = function(username) {
    return users[username].personal_info.get_email_address();
  }

  that.send_emails = function(username, to_send, students, callback) {
    var u = users[username];
    u.emails.send(u.personal_info.get_email_address(),
		  u.personal_info.get_email_password(),
		  u.emails.get(to_send),
		  students,
		  callback);
  }

  that.set_email_addr = function(username, new_address, new_password) {
    users[username].personal_info.update_email(new_address, new_password);
    db_save(username);
  }

  that.get_email_addr = function(username) {
    return users[username].personal_info.get_email_address();
  }

  that.class_list = function(username) {
    return users[username].classes.class_list();
  }

  that.add_class = function(username, class_name, students) {
    var result = users[username].classes.add_class(class_name, students);
    db_save(username);
    return result;
  }

  that.update_class = function(username, class_name, new_students) {
    var result = users[username].classes.update_class(class_name, new_students);
    db_save(username);
    return result;
  }

  that.students = function(username, class_name) {
    return users[username].classes.students(class_name);
  }

  that.remove_class = function(username, class_name) {
    users[username].classes.remove_class(class_name);
    db_save(username);
  }

  that.add_student = function(username,
			      class_name,
			      student_name,
			      student_email) {
    users[username].classes.add_student(class_name,
					student_name,
					student_email);
    db_save(username);
  }

  Object.freeze(that);
  return that;
}

module.exports = User_data
