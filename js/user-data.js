var Personal_info = require("./personal_info.js");
var Classes = require("./classes.js");
var Emails = require("./emails.js");

var User_data = function() {
  var that = Object.create(null);
  var users = {}

  // return true if new user created successfully otherwise false if present
  that.add_user = function(username, password, email_address, email_password) {
    if (users[username]) return false;
    users[username] = {
      'personal_info': Personal_info(password, email_address, email_password),
      'classes': Classes(),
      'emails': Emails(),
    };
    users[username].personal_info.sync();
    users[username].classes.sync();
    users[username].emails.sync();
    return true;
  }

  that.update_email_to_send = function(username, email_name, subject, text) {
    users[username].emails.set(email_name, subject, text);
    users[username].emails.sync();
  }

  that.contains_user = function(username) {
    return username in users;
  }

  that.password = function(username) {
    return users[username].personal_info.get_password();
  }

  that.email = function(username) {
    return users[username].personal_info.get_email_address();
  }

  that.send_emails = function(username, to_send, class_name, students) {
    var u = users[username];
    u.emails.send(u.personal_info.email_addr(),
		  u.get_email(to_send),
		  u.classes.extract(class_name, students));
  }

  that.set_email_addr = function(username, new_address, new_password) {
    users[username].personal_info.update_email(new_address, new_password);
    users[username].personal_info.sync();
  }

  that.class_list = function(username) {
    return users[username].classes.class_list();
  }

  that.add_class = function(username, class_name, students) {
    var result = users[username].classes.add_class(class_name, students);
    users[username].classes.sync();
    return result;
  }

  that.update_class = function(username, class_name, new_students) {
    var result = users[username].classes.update_class(class_name, new_students);
    users[username].classes.sync();
    return result;
  }

  that.students = function(username, class_name) {
    return users[username].classes.students(class_name);
  }

  that.remove_class = function(username, class_name) {
    users[username].classes.remove_class(class_name);
    users[username].classes.sync();
  }

  that.add_student = function(username,
			      class_name,
			      student_name,
			      student_email) {
    users[username].classes.add_student(class_name,
					student_name,
					student_email);
  }

  Object.freeze(that);
  return that;
}

module.exports = User_data
