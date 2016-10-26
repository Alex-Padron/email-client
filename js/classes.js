var Classes = function() {
  var that = Object.create(null);
  var students = {}
  var persister = undefined;

  var init_class = function(class_name) {
    students[class_name] = []
  }

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
    if (new_students.length == 0) return false;
    students[class_name] = [];
    for (var i = 0; i < new_students.length; i++) {
      var student = new_students[i];
      if ((!student.name) || (!student.email)) {
	delete students[class_name];
	return false;
      }
      students[class_name].push(student);
    }
    return true;
  }

  that.update_class = function(class_name, new_students) {
    if (!students[class_name]) return false;
    if (new_students.length == 0) return false;
    var prior = students[class_name];
    students[class_name] = [];
    for (var i = 0; i < new_students.length; i++) {
      var student = new_students[i];
      if ((!student.name) || (!student.email)) {
	students[class_name] = prior;
	return false;
      }
      students[class_name].push(student);
    }
    return true;
  }

  that.remove_class = function(class_name) {
    delete students[class_name];
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

  that.students = function(class_name) {
    if (!students[class_name]) return [];
    return students[class_name].slice();
  }

  that.get_json_string = function() {
    return JSON.stringify(students);
  }

  that.parse_json_string = function(str) {
    students = JSON.parse(str);
  }
  Object.freeze(that);
  return that;
}

module.exports = Classes;
