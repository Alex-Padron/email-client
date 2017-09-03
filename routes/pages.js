var add_pages = function(app, user_data) {

  app.get("/", function(req, res) {
    res.render("send-emails.html");
  });

  app.get("/edit_classes", function(req, res) {
    res.render("edit-classes.html");
  });

  app.get("/edit_emails", function(req, res) {
    res.render("edit-emails.html");
  });

  app.get("/edit_account_info", function(req, res) {
    res.render("edit-account-info.html");
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

  app.post("/classes", function(req, res) {
    var class_name = req.body.class_name;
    var students = req.body.students;
    var username = req.session.username;
    console.log("NEW CLASS", class_name, "USER", username);
    var success = user_data.add_class(username, class_name, students);
    res.json({'success': success});
    res.end();
  });

  app.put("/classes", function(req, res) {
    var username   = req.session.username;
    var class_name = req.body.class_name;
    var students   = req.body.students;
    console.log("UPDATE CLASS", class_name, "USER", username);
    var success = user_data.update_class(username, class_name, students);
    res.json({'success': success});
    res.end();
  });

  app.delete("/classes/:class_name", function(req, res) {
    var username = req.session.username;
    var class_name = req.params.class_name;
    console.log("DELETE CLASS", class_name, "USER", username);
    user_data.remove_class(username, class_name);
    res.end();
  });

  app.get("/classes/class_list", function(req, res) {
    res.json(user_data.class_list(req.session.username));
    res.end();
  });

  // return the students in a given class
  app.get("/classes/single/:class_name", function(req, res) {
    var username = req.session.username;
    res.json(user_data.students(username, req.params.class_name));
    res.end();
  });

  app.post("/emails", function(req, res) {
    var username = req.session.username;
    var email_name = req.body.email_name;
    var subject = req.body.subject;
    var text = req.body.text;
    console.log("NEW EMAIL NAME", email_name,
		"SUBJECT", subject,
		"USER", username);
    var success =
      user_data.add_email_to_send(username, email_name, subject, text);
    res.json({'success': success});
    res.end();
  });

  app.put("/emails", function(req, res) {
    var username = req.session.username;
    var email_name = req.body.email_name;
    var subject = req.body.subject;
    var text = req.body.text;
    console.log("UPDATE EMAIL NAME", email_name,
		"SUBJECT", subject,
		"USER", username);
    var success =
      user_data.update_email_to_send(username, email_name, subject, text);
    res.json({'success': success});
    res.end();
  });

  app.delete("/emails/:email_name", function(req, res) {
    var username = req.session.username;
    var email_name = req.params.email_name;
    user_data.remove_email_to_send(username, email_name);
    res.end();
  });

  app.get("/emails", function(req, res) {
    var username = req.session.username;
    res.json(user_data.get_emails_list(username));
    res.end();
  });

  app.get("/emails/single/:email_name", function(req, res) {
    var username = req.session.username;
    var email_name = req.params.email_name;
    res.json(JSON.stringify(user_data.get_email_to_send(username, email_name)));
    res.end();
  });

  app.post("/emails/send", function(req, res) {
    var username = req.session.username;
    var email_name = req.body.email_name;
    var students = JSON.parse(req.body.students);
    var date_string = req.body.date_string;
    console.log("SEND EMAIL USER", username, "EMAIL", email_name,
		"STUDENTS", students, "DATE_STRING", date_string);
    user_data.send_emails(username, email_name, students, date_string, function(err) {
      if (err) {
	res.json({"success": false, "error": JSON.stringify(err)})
      } else {
	res.json({"success": true});
      }
      res.end();
    });
  });

  app.post("/emails/sample", function(req, res) {
    var username = req.session.username;
    var email_name = req.body.email_name;
    var date_string = req.body.date_string;
    console.log("SAMPLE EMAIL USER", username, "EMAIL", email_name);
    var students = [{
      "email": user_data.get_email_addr(username),
      "name": username
    }];
    user_data.send_emails(username,
			  email_name,
			  students,
			  date_string,
			  function(err) {
      if (err) {
	res.json({"success": false, "error": JSON.stringify(err)})
      } else {
	res.json({"success": true});
      }
      res.end();
    });
  });
}

module.exports = add_pages
