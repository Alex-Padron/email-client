var class_display_widget = function(dom_container,
				    class_name,
				    students,
				    new_students_callback,
				    delete_callback) {
  dom_container.empty();

  var parsed_students = [];

  var header = $("<h3>" + class_name + "</h3>");
  header.css("margin-top", "40px");

  var upload_button =
    create_file_input("new_student_files", "edit_class_info_text",
		      function(new_parsed_students) {
			console.log("uploaded students", new_parsed_students);
			parsed_students = new_parsed_students
		      });

  var info_text = $("<p id='edit_class_info_text'></p>");

  var to_file_string = function(students) {
    fs = "";
    for (var i = 0; i < students.length; i++) {
      fs += students[i].name + " " + students[i].email + "\n";
    }
    return fs;
  }

  var download_button = $("<a>Download Current Class File</a>");
  download_button.attr("href", "data:text/plain;charset=utf-8," +
			       encodeURIComponent(to_file_string(students)));
  download_button.attr("download", class_name + "-students.txt");
  var download_container = $("<div style='margin-bottom: 20px'></div>");
  download_button.appendTo(download_container);
  header.appendTo(dom_container);
  upload_button.appendTo(dom_container);
  info_text.appendTo(dom_container);
  download_container.appendTo(dom_container);

  var submit_to_server = function() {
    if (parsed_students.length == 0) {
      $("#edit_class_info_text").text("no new students uploaded");
      return;
    }

    var success = function() {
      console.log("updated class users");
    }

    var error = function(err) {
      console.log(err);
    }

    $.ajax({
      url: "/classes",
      type: "PUT",
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
  }

  var submit_div = $("<div class='btn-group'></div>");
  var submit_button = $("<button class='btn btn-default'>Submit</button>");
  submit_button.click(submit_to_server);
  var cancel_button = $("<button class='btn btn-default'>Cancel</button>");
  cancel_button.click(cancel);
  submit_button.appendTo(submit_div);
  cancel_button.appendTo(submit_div);
  submit_div.appendTo(dom_container);

  var delete_button = $("<button class='btn btn-danger'>Delete</button>");
  var delete_button_div = $("<div></div>");
  delete_button.click(delete_callback);
  delete_button.appendTo(delete_button_div);
  delete_button_div.appendTo(dom_container);
};
