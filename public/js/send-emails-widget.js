var send_emails_widget = function(dom_container, students, send_emails) {
  dom_container.empty();
  students = students.map(function(student) {
    var btn = $("<button type='button' class='btn btn-default'>"
		+ student.name + " : " + student.email
		+ "</button><br>");
    btn.css("color", "green");
    btn.attr("student_email", student.email);
    btn.attr("sending", false);
    btn.click(function() {
      // use string comparison here since attributes are always
      // stored as strings
      if (btn.attr("sending") === "true") {
	btn.attr("sending", false);
	btn.css("color", "green");
      } else {
	btn.css("color", "red");
	btn.attr("sending", true);
      }
    });
    btn.appendTo(dom_container);
    return btn;
  });

  var send_button = $("<button type='button' class='btn btn-primary'>Send Emails</button>");
  send_button.click(function() {
    var to_send = students.filter(function(student) {
      return student.attr("sending") === "true";
    }).map(function(student) {
      return student.attr("student_email");
    })
    send_emails(to_send);
  });
  send_button.appendTo(dom_container);
}
