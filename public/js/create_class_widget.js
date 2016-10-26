var create_class_widget = function(dom_container, success_hook, cancel_hook) {
  var sample_students_file = "Alex alex_p@mit.edu \nScott scott_p@mit.edu";

  var name_label = $("<label>Name:</label>");
  var new_name = $("<input type='text' class='form-control'></input>");
  name_label.appendTo(dom_container);
  new_name.appendTo(dom_container);

  var parsed_students = [];

  var submit_to_server = function() {
    var info_text = $("#create_class_info_text");
    if (parsed_students.length == 0) {
      info_text.text("No students were parsed from file");
      return;
    }
    var class_name = new_name.val();
    if (class_name.length < 1) {
      info_text.text("Class name is empty");
      return;
    }
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
      url: "/classes",
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

  var student_list_label =
    create_file_input("student_file", "create_class_info_text",
		      function(new_parsed_students) {
			parsed_students = new_parsed_students;
		      });

  student_list_label.appendTo(dom_container);

  var download_button = $("<a>Download Sample Students File</a>");
  download_button.attr("href", "data:text/plain;charset=utf-8," +
		       encodeURIComponent(sample_students_file));
  download_button.attr("download", "sample-students.txt");
  var download_container = $("<div style='margin-bottom: 10px'></div>");
  download_button.appendTo(download_container);
  download_container.appendTo(dom_container);

  var info_text_dom = $("<p id='create_class_info_text'></p>");
  info_text_dom.appendTo(dom_container);

  var submit_div = $("<div class='btn-group'></div>");
  var submit_button = $("<button class='btn btn-default'>Submit</button>");
  submit_button.click(submit_to_server);
  var cancel_button = $("<button class='btn btn-default'>Cancel</button>");
  cancel_button.click(cancel);
  submit_button.appendTo(submit_div);
  cancel_button.appendTo(submit_div);
  submit_div.appendTo(dom_container);
}
