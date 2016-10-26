$(function() {
  $('.dropdown-toggle').dropdown();
  var load_single_email = function(email_name) {
    var success = function(result) {
      result = JSON.parse(result);
      email_widget($("#email_display"),
		   load_dropdown,
		   false,
		   email_name,
		   result.subject,
		   result.text);
    }
    var error = function(err) {
      console.log("error from server", err);
    }
    $.ajax({
      url: "/emails/single/" + email_name,
      type: "GET",
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  }

  var load_dropdown = function() {
    var success = function(emails) {
      dropdown_widget_install($("#dropdown"), emails, load_single_email);
    }
    var error = function(err) {
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

  $("#new_email").click(function() {
    email_widget($("#new_email_div"), load_dropdown, true);
  });

  load_dropdown();
});
