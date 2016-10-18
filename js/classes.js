var nodemailer = require('nodemailer')

var Classes = function() {
  var that = Object.create(null);
  var students = {}

  var init_class = function(class_name) {
    students[class_name] = []
  }
  that.sync = function() {}

  that.add_student = function(class_name, student_name, email_addr) {
    if (!students[class_name]) init_class(class_name);
    students[class_name].push({
      'name': student_name,
      'email': email_addr
    });
  }

  that.remove_student = function(class_name, student_name) {
    if (students[class_name][student_name])
      delete students[class_name][student_name];
  }

  that.add_class = function(class_name, new_students) {
    if (students[class_name]) return false;
    students[class_name] = [];
    for (var i = 0; i < new_students.length; i++) {
      var student = new_students[i];
      if (!student.name || !student.email) {
	delete students[class_name];
	return false;
      }
      students[class_name].push(student);
    }
    return true;
  }

  that.remove_class = function(name) {
    delete students[name];
  }

  that.extract = function(class_name, student_names) {
    var email_addrs = []
    for (student_name in student_names) {
      if (students[class_name][student_name]) {
	email_addrs.push(students[class_name][student_name]);
      }
    }
  }

  that.class_list = function() {
    return Object.keys(students);
  }

  Object.freeze(that);
  return that;
}

module.exports = Classes;
