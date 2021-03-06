var class_display_widget = function(dom_container,
				    class_name,
				    students,
				    delete_callback) {
  dom_container.empty();

  var parsed_students = [];

  var header = $("<h3>" + class_name + "</h3>");
  header.css("margin-top", "40px");

  var upload_button =
    create_file_input("new_student_files", "edit_class_info_text",
		      function(new_parsed_students) {
			parsed_students = new_parsed_students
		      });

  var info_text = $("<p id='edit_class_info_text'></p>");

  var to_file_string = function(students) {
    fs = "";
    for (var i = 0; i < students.length; i++) {
      fs += students[i].name + ", " + students[i].email + "\r\n";
    }
    return fs;
  }

  header.appendTo(dom_container);
  upload_button.appendTo(dom_container);
  var download = download_button("Download Current Class File",
				 encodeURIComponent(to_file_string(students)),
				 class_name + "-students.txt");
  download.appendTo(dom_container);
  info_text.appendTo(dom_container);

  var submit_delete_to_server = function() {
    var success = function() {
      dom_container.empty();
      delete_callback();
    }
    var error = function() {
      info_text.text("unable to contact server");
    }
    $.ajax({
      url: "/classes/" + class_name,
      type: "DELETE",
      success: success,
      error: error,
      timeout: 2000
    });
  }

  var submit_update_to_server = function() {
    if (parsed_students.length == 0) {
      info_text.text("no new students uploaded");
      return;
    }

    var success = function(result) {
      if (result.success) {
	dom_container.empty();
      } else {
	info_text.text("unable to update class");
      }
    }

    var error = function(err) {
      console.log(err);
      info_text.text("unable to contact server");
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
  submit_button.click(submit_update_to_server);
  var cancel_button = $("<button class='btn btn-default'>Cancel</button>");
  cancel_button.click(cancel);
  submit_button.appendTo(submit_div);
  cancel_button.appendTo(submit_div);
  submit_div.appendTo(dom_container);

  var delete_button = $("<button class='btn btn-danger'>Delete</button>");
  var delete_button_div = $("<div></div>");
  delete_button.click(submit_delete_to_server);
  delete_button.appendTo(delete_button_div);
  delete_button_div.appendTo(dom_container);
};
