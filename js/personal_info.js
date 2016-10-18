var Personal_info = function(password, email_address, email_password) {
  var that = Object.create(null);

  that.sync = function() {}

  that.update_email = function(new_address, new_password) {
    email_address = new_address;
    password = new_password;
  }

  that.get_password = function() {
    return password;
  }

  that.get_email_address = function() {
    return email_address;
  }

  that.get_email_password = function() {
    return email_password;
  }

  Object.freeze(that);
  return that;
}

module.exports = Personal_info;
