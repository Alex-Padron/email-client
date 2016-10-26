var nodemailer = require('nodemailer');
var smtp_transport = require('nodemailer-smtp-transport');

var Emails = function() {
  var that = Object.create(null);
  var emails = {}

  that.sync = function() {}

  // return whether the email was added successfully
  that.add = function(name, subject, text) {
    if (name.length    == 0 ||
	subject.length == 0 ||
	text.length    == 0 ||
	emails[name])
      return false;
    emails[name] = {
      'subject': subject,
      'text': text,
    };
    return true;
  }

  // return whether the email was updated successfully
  that.update = function(name, subject, text) {
    if (!emails[name]) return false;
    emails[name] = {
      'subject': subject,
      'text': text
    };
    return true;
  }

  that.get = function(email_name) {
    return emails[email_name];
  }

  that.get_names = function() {
    return Object.keys(emails);
  }

  that.remove = function(email_name) {
    if (emails[email_name]) delete emails[email_name];
  }

  that.send = function(email_addr, password, to_send, students) {
    console.log("sending email with username", email_addr,
		"and password", password);
    var transporter = nodemailer.createTransport(smtp_transport({
      service: "gmail",
      auth: {
	user: email_addr,
	pass: password
      }
    }));

    var mailOptions = {
      from: "email_addr",
      to: "",
      subject: to_send.subject,
      text: to_send.text,
    };
    students.forEach(function(student_email) {
      mailOptions.to = student_email;
      transporter.sendMail(mailOptions, function(error, info){
	if(error){
          return console.log(error);
	}
	console.log('Message sent: ' + info.response);
      });
    });
  }

  // add some default texts
  emails["no homework"] = {
    subject: "Classroom Alert: No Homework",
    text: "Your child did not do his homework today"
  };
  emails["not prepared"] = {
    subject: "Classroom Alert: Not Prepared",
    text: "Your child was not prepared for class today"
  };

  Object.freeze(that);
  return that;
}

module.exports = Emails;
