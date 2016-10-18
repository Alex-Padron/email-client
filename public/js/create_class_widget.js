var create_class_widget = function(dom_container, success_hook, cancel_hook) {
  var name_label = $("<label>Name:</label>");
  var new_name = $("<input type='text' class='form-control'></input>");
  name_label.appendTo(dom_container);
  new_name.appendTo(dom_container);

  var parsed_students = [];
  var info_text = $("#edit_class_info_text");

  // parse text and return whether it parsed correctly
  var parse = function(text) {
    parsed_students = [];
    var lines = text.split("\n");
    if (lines.length == 0) return false;
    for (var i = 0; i < lines.length; i++) {
      var line = $.trim(lines[i]).split(" ");
      if (line.length != 2) {
	parsed_students = [];
	return false;
      }
      parsed_students.push({
	'name': line[0],
	'email': line[1],
      });
    }
    return true;
  }

  var submit_to_server = function() {
    if (parsed_students.length == 0) {
      info_text.text("No students were parsed from file");
      return;
    }
    var class_name = new_name.val();
    if (class_name.length < 1) {
      info_text.text("Class name is empty");
      return;
    }
    console.log("submitting new class request");
    var success = function(data) {
      if (data.success) {
	dom_container.empty();
	success_hook();
      } else {
	info_text.text("Unable to make class, likely because a class with this \
name already exists");
      }
    }
    var error = function(err) {
      info_text.text("Error contacting server");
    }
    $.ajax({
      url: "/classes/new_class",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
	'class_name': class_name,
	'students': parsed_students
      }),
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  }

  var cancel = function() {
    dom_container.empty();
    cancel_hook();
  }

  var student_list_label = $("<label class='btn btn-default btn-file'> \
Upload Student File <input id='student_file' accept='.txt' type='file'  \
style='display: none;'></label>");

  student_list_label.change(function() {
    var student_file = $("#student_file");
    var reset_file_element = function(element) {
      element.replaceWith(element.clone(true));
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      if(parse(e.target.result)) {
	info_text.text("File uploaded successfully");
      } else {
	info_text.text("File did not parse correctly");
      }
    }
    reader.onerror = function(e) { console.log(e); }
    reader.readAsText(student_file.get(0).files[0]);
    reset_file_element(student_file);
  });

  student_list_label.appendTo(dom_container);

  var info_text = $("<p id='edit_class_info_text'></p>");
  info_text.appendTo(dom_container);

  var submit_div = $("<div class='btn-group'></div>");
  var submit_button = $("<button class='btn btn-default'>Submit</button>");
  submit_button.click(submit_to_server);
  var cancel_button = $("<button class='btn btn-default'>Cancel</button>");
  cancel_button.click(cancel);
  submit_button.appendTo(submit_div);
  cancel_button.appendTo(submit_div);
  submit_div.appendTo(dom_container);
}
