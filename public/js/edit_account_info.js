$(function() {
  var current_email = $("#current_email");

  var validate = function(email_addr, email_password) {
    var error_text = $("#error_text");
    if (email_addr.length < 1) {
      error_text.text("Email field must be non empty");
      return false;
    }
    if (email_password.length < 1) {
      error_text.text("Email password field must be non empty");
      return false;
    }
    error_text.text("");
    return true;
  }

  var display_email = function(data) {
    $("#current_email").text("Currently using email: " + data);
  }

  var load_email = function() {
    $.ajax({
      url: "/personal_info/email",
      type: "GET",
      success: function(data) {
	display_email(data);
      },
      error: function(err) {
	  console.log("Error loading current email", err);
      },
      timeout: 2000,
      contentType: "application/json",
    });
  }

  var submit_new_email = function() {
    var new_address = $("#email_address").val();
    var new_password = $("#email_password").val();
    if (validate(new_address, new_password)) {
      $.ajax({
	url: "/personal_info/update_email",
	type: "POST",
	dataType: "json",
	data: JSON.stringify({
	  "email_address": new_address,
	  "email_password": new_password,
	}),
	success: load_email,
	error: load_email(),
	timeout: 2000,
	contentType: "application/json",
      });
    }
  }

  var text_box_login = function(e) {
    if (e.which == 13) {
      submit_new_email();
      return false;
    }
  }

  $("#update_email").click(submit_new_email);
  $("#email_address").keypress(text_box_login);
  $("#email_password").keypress(text_box_login);

  load_email();
});
