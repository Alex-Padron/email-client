var create_file_input = function(id, info_text_id, file_callback) {
  var parsed_students;

  // parse text and return whether it parsed correctly
  var parse = function(text) {
    parsed_students = [];
    var lines = text.split("\n");
    if (lines.length == 0) return false;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].split(",");
      if (line.length == 2) {
	parsed_students.push({
	  'name': $.trim(line[0]),
	  'email': $.trim(line[1]),
	});
      } else if (line.length != 1 || $.trim(line[0]) !== "") {
	parsed_students = [];
	return false;
      }
    }
    return true;
  }

  var student_list_label = $("<label class='btn btn-default btn-file'> \
Upload Student File <input id='" + id + "' accept='.txt' type='file'  \
style='display: none;'></label>");

  student_list_label.change(function() {
    var student_file = $("#" + id);
    var info_text = $("#" + info_text_id);
    var reset_file_element = function(element) {
      element.replaceWith(element.clone(true));
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      if(parse(e.target.result)) {
	info_text.text("File uploaded successfully");
	file_callback(parsed_students);
      } else {
	info_text.text("File did not parse correctly");
      }
    }
    reader.onerror = function(e) { console.log(e); }
    reader.readAsText(student_file.get(0).files[0]);
    reset_file_element(student_file);
  });

  return student_list_label;
}
