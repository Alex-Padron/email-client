$(function() {
  var info_text = $("#info_text");
  $('.dropdown-toggle').dropdown();
  var info_text = $("#info_text");
  var email_name; // name of the selected email
  var class_students; // all students in the selected class

  var save_email = function(new_email_name) {
    var email_button = $("#email_button");
    email_button.text(new_email_name + " ");
    var span = $("<span class='caret'></span>");
    span.appendTo(email_button);
    email_name = new_email_name;
  }

  var send_emails = function(students, date_string) {
    if (!email_name) {
      info_text.text("must select an email to send");
      return;
    }
    if (students.length == 0) {
      info_text.text("no students selected");
      return;
    }
    var success = function(result) {
      if (result.success) {
	info_text.text("emails sent successfully");
      } else {
	info_text.text("email failed to send: " + result.error);
      }
    }
    var error = function(err) {
      info_text.text("Connection error: check email to see if sent");
      console.log(err);
    }
    $.ajax({
      url: "/emails/send",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
	'email_name': email_name,
	'students': JSON.stringify(students),
	'date_string': date_string
      }),
      success: success,
      error: error,
      timeout: 5000,
      contentType: "application/json",
    });
    // reinstall the widget after sending to prevent double clicking
    send_emails_widget($("#to_send"), class_students, send_emails);
  }

  var render_class = function(class_name) {
    var class_button = $("#class_button");
    class_button.text(class_name + " ");
    var span = $("<span class='caret'></span>");
    span.appendTo(class_button);
    var success = function(new_students) {
      class_students = new_students;
      send_emails_widget($("#to_send"), class_students, send_emails);
    }
    var error = function(err) {
      info_text.text(err);
      console.log(err);
    }
    $.ajax({
      url: "/classes/single/" + class_name,
      type: "GET",
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  }

  var load_emails = function() {
    var success = function(emails) {
      dropdown_widget_install($("#email_dropdown"), emails, save_email);
    }
    var error = function(err) {
      info_text.text("unable to contact server");
      console.log(err);
    }
    $.ajax({
      url: "/emails",
      type: "GET",
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  }

  var load_classes = function() {
    var success = function(classes) {
      dropdown_widget_install($("#class_dropdown"), classes, render_class);
    }
    var error = function(err) {
      info_text.text("unable to contact server");
      console.log(err);
    }
    $.ajax({
      url: "/classes/class_list",
      type: "GET",
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  }

  $("#test_email").click(function() {
    var success = function(result) {
      if (result.success) {
	info_text.text("sample email sent successfully");
      } else {
	info_text.text("sample email failed to send: " + result.error);
      }
    }
    var error = function(err) {
      info_text.text("unable to contact server");
      console.log(err);
    }
    $.ajax({
      url: "/emails/sample",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
	'email_name': email_name,
      }),
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  });
  load_emails();
  load_classes();
});
