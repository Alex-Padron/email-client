var add_pages = function(app, user_data) {

  app.get("/", function(req, res) {
    res.render("class_display.html");
  });

  app.get("/edit_classes", function(req, res) {
    res.render("edit_classes.html");
  });

  app.get("/edit_emails", function(req, res) {
    res.render("edit_emails.html");
  });

  app.get("/edit_account_info", function(req, res) {
    res.render("edit_account_info.html");
  });

  app.get("/personal_info/email", function(req, res) {
    var username = req.session.username;
    res.json(user_data.email(username));
    res.end();
  });

  app.post("/personal_info/update_email", function(req, res) {
    console.log("UPDATE EMAIL", req.body.email_address,
		"USER", req.session.username);
    user_data.set_email_addr(req.session.username,
			     req.body.email_address,
			     req.body.email_password);
    res.end();
  });

  app.post("/classes/new_class", function(req, res) {
    var class_name = req.body.class_name;
    var students = req.body.students;
    var username = req.session.username;
    console.log("NEW CLASS", class_name, "USER", username);
    var success = user_data.add_class(username, class_name, students);
    res.json({'success': success});
    res.end();
  });

  app.get("/classes/class_list", function(req, res) {
    res.json(user_data.class_list(req.session.username));
    res.end();
  });
}

module.exports = add_pages
