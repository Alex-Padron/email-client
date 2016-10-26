/*
  Inserts an email widget into [dom_container].
  @param on_update {function} called if email state is updated
  @param is_new {bool} whether this widget is for creating a new
  email, [true], or for updating an existing email [false]
  @param name, subject, text {string} of the email that we are
  updating. Not used if [is_new].
*/
var email_widget = function(dom_container,
			    on_update,
			    is_new,
			    email_name,
			    subject,
			    text) {
  dom_container.empty();
  var info_text = $("<p id='new_email_info_text'></p>");
  var name_label = $("<label>Name</label>");
  var subject_label = $("<label>Subject</label>");
  var text_label = $("<label>Text</label>");
  var name_input = $("<input type='text' class='form-control'></input>");
  var subject_input = $("<input type='text' class='form-control'></input>");
  var text_input = $("<textarea rows='10' class='form-control'></textarea>");
  if (!is_new) {
    name_input = $("<p>" + email_name + "</p>");
    subject_input.val(subject);
    text_input.val(text);
  }
  name_label.appendTo(dom_container);
  name_input.appendTo(dom_container);
  subject_label.appendTo(dom_container);
  subject_input.appendTo(dom_container);
  text_label.appendTo(dom_container);
  text_input.appendTo(dom_container);

  var validate = function(name, subject, text) {
    if (name.length == 0) {
      info_text.text("No name is present");
      return false;
    }
    if (subject.length == 0) {
      info_text.text("No subject present");
      return false;
    }
    if (text.length == 0) {
      info_text.text("No text present");
      return false;
    }
    return true;
  }

  var submit_to_server = function() {
    if (is_new) email_name = name_input.val();
    subject = subject_input.val();
    text = text_input.val();
    if (!validate(email_name, subject, text)) return;

    if (is_new) {
      var success = function(result) {
	if (result.success) {
	  dom_container.empty();
	  on_update();
	} else {
	  info_text.text("unable to create new email, probably already an email \
with this name");
	}
      }
      var error = function(err) {
	info_text.text("error contacting server");
	console.log(err);
      }
      $.ajax({
	url: "/emails",
	type: "POST",
	dataType: "json",
	data: JSON.stringify({
	  'email_name': email_name,
	  'subject': subject,
	  'text': text
	}),
	success: success,
	error: error,
	timeout: 2000,
	contentType: "application/json",
      });
    } else {
      var success = function(result) {
	if (result.success) {
	  dom_container.empty();
	  on_update();
	} else {
	  info_text.text("unable to update email, reload and try again");
	}
      }
      var error = function(err) {
	info_text.text("error contacting server");
	console.log(err);
      }
      $.ajax({
	url: "/emails",
	type: "PUT",
	dataType: "json",
	data: JSON.stringify({
	  'email_name': email_name,
	  'subject': subject,
	  'text': text
	}),
	success: success,
	error: error,
	timeout: 2000,
	contentType: "application/json",
      });
    }
  }

  var submit_delete_to_server = function() {
    var success = function() {
      dom_container.empty();
      on_update();
    }
    var error = function() {
      info_text.text("unable to contact server");
    }
    $.ajax({
      url: "/emails/" + email_name,
      type: "DELETE",
      success: success,
      error: error,
      timeout: 2000
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
  info_text.appendTo(dom_container);
  if (!is_new) {
    var delete_button = $("<button class='btn btn-danger'>Delete</button>");
    var delete_button_div = $("<div></div>");
    delete_button.click(submit_delete_to_server);
    delete_button.appendTo(delete_button_div);
    delete_button_div.appendTo(dom_container);
  }
}
