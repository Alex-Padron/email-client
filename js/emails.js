var Emails = function() {
  var that = Object.create(null);
  var emails = {}

  that.sync = function() {}

  that.set = function(name, subject, text) {
    emails[name] = {
      'subject': subject,
      'text': text,
    };
  }

  that.delete_email = function(name) {
    delete emails[name];
  }

  that.format = function(email_name, username, email_addr) {
    return {
      from: username + ", <" + email_addr + ">",
      subject: emails[email_name.subject],
      text: emails[email_name.text],
    };
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
