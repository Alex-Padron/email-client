$(function() {
  /**
     @param username {String} of the user to log in
     @param password {String} of the user to log in
     @param success {function} callback
     @param error {function} callback
  */
  var login = function(username, password, success, error) {
    $.ajax({
      url: "/login",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
	"username": username,
	"password": password,
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
    if (email_addr && email_addr.length < 1) {
      error_text.text("Email field must be non empty");
      return false;
    }
    if (email_password && email_password.length < 1) {
      error_text.text("Email password field must be non empty");
      return false;
    }
    error_text.text("");
    return true;
  }

  var validate_and_login = function() {
    var username = $("#username").val();
    var password = $("#password").val();
    if (validate(username, password)) {
      var success = function(data) {
	if (data.success) {
	  window.location.href = "/";
	} else {
	  $("#error_text").text("Username or Password Incorrect");
	}
      }
      var error = function() {
	$("error_text").text("Server is unavailable right now");
      }
      login(username, password, success, error);
    }
  }

  var text_box_login = function(e) {
    if (e.which == 13) {
      validate_and_login();
      return false;
    }
  }

  $("#login").click(validate_and_login);
  $("#username").keypress(text_box_login);
  $("#password").keypress(text_box_login);

  // send a new accout request when new account button pressed
  $("#new_account").click(function() {
    window.location.href = "/new_account";
  });
});
