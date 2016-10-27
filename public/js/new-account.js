$(function() {

  var new_account = function(username,
			     password,
			     email_address,
			     email_password,
			     success,
			     error) {
    $.ajax({
      url: "/new_account",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
	"username": username,
	"password": password,
	"email_address": email_address,
	"email_password": email_password
      }),
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  }

  // provide basic validation on the inputted username and password
  // and populate the error text div if there is an error
  var validate = function(username, password, email_addr, email_password) {
    var error_text = $("#error_text");
    if (username.length < 5) {
      error_text.text("Username must be at least 5 characters");
      return false;
    }
    if (password.length < 5) {
      error_text.text("Password must be at least 5 characters");
      return false;
    }
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

  var validate_and_login = function() {
    var username = $("#username").val();
    var password = $("#password").val();
    var email_address = $("#email_address").val();
    var email_password = $("#email_password").val();
    if (validate(username, password, email_address, email_password)) {
      var success = function(data) {
	if (data.success) {
	  window.location.href = "/";
	} else {
	  $("#error_text").text("Unable to create new account");
	}
      }
      var error = function() {
	$("error_text").text("Server is unavailable right now");
      }
      new_account(username,
		  password,
		  email_address,
		  email_password,
		  success,
		  error);
    }
  }

  var text_box_login = function(e) {
    if (e.which == 13) {
      validate_and_login();
      return false;
    }
  }

  $("#new_account").click(validate_and_login);
  $("#username").keypress(text_box_login);
  $("#username").focus();
  $("#password").keypress(text_box_login);
  $("#email_address").keypress(text_box_login);
  $("#email_password").keypress(text_box_login);

  // send a new accout request when new account button pressed
  $("#login").click(function() {
    window.location.href = "/login";
  });
});
