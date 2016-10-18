var mongoose = require("mongoose");

/*
  Abstraction to contain client usernames and passwords. Automatically
  loads and stores clients in the database
*/
var Clients = function() {
  var that = Object.create(null);
  var clients = {}; // map from username to password

  var client_schema = mongoose.Schema({
    username: String,
    password: String
  });
  var client_model = mongoose.model("email_clients", client_schema);
  var persister = require("./persist.js")(client_model);

  persister.load(function(err, client_list) {
    if (err) console.log("LOADING CLIENT STATE ERROR", err);
    client_list.forEach(function(client) {
      if (client.username && client.password)
	clients[client.username] = client.password;
    });
    console.log("RELOADED CLIENT STATE SUCCESSFULLY \n clients:\n", clients);
  });

  var db_save = function(username, password) {
    persister.persist({
      username: username,
      password: password
    }, function() {
      console.log("SAVED CLIENT STATE");
    });
  }

  /**
    Attempts to add a username and password to the data
    @param username {String} to add
    @param password {String} to add
    @return {bool} whether [username] [password] was added successfully.
   */
  that.add = function(username, password, email_address, email_password) {
    if (username in clients) return false;
    clients[username] = {
      'password': password,
      'email_address': email_address,
      'email_password': email_password
    };
    return true;
  }

  /**
    @param username {String} username to query
    @return {string} the password for [username], or undefined if [username]
    is not stored
   */
  that.get = function(username) {
    return clients[username];
  }

  Object.freeze(that);
  return that;
}

module.exports = Clients;
