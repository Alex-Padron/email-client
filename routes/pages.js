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
    console.log("updating email for user with username", req.body.email_address, 
	       "and password", req.body.email_password);
    user_data.set_email_addr(req.session.username,
			     req.body.email_address,
			     req.body.email_password);
    res.end();
  });
}

module.exports = add_pages
