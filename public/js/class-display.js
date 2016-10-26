$(function() {
  var info_text = $("#info_text");
  $('.dropdown-toggle').dropdown();
  var email_name;
  var info_text = $("#info_text");

  var save_email = function(new_email_name) {
    console.log("using email name", new_email_name);
    $("#email_button").text(new_email_name);
    email_name = new_email_name;
  }

  var send_emails = function(students) {
    if (!email_name) {
      info_text.text("must select an email to send");
      return;
    }
    if (students.length == 0) {
      info_text.text("no students selected");
      return;
    }
    console.log("sending emails to students", students);
    var success = function(result) {
      if (result.success) {
	info_text.text("emails sent successfully");
      } else {
	info_text.text("email failed to send: " + result.error_s);
      }
    }
    var error = function(err) {
      info_text.text("unable to contact server");
      console.log(err);
    }
    $.ajax({
      url: "/emails/send",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
	'email_name': email_name,
	'students': JSON.stringify(students)
      }),
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });

  }

  var render_class = function(class_name) {
    console.log("using class_name", class_name);
    $("#class_button").text(class_name);
    var success = function(students) {
      console.log("got students", students);
      send_emails_widget($("#to_send"), students, send_emails);
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
      console.log("loaded emails", emails, "from server");
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
      console.log("got classes from server", classes);
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
  load_emails();
  load_classes();
});
