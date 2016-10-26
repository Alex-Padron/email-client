var session = require("express-session");

/*
  Function that adds authentication to the app, redirecting traffic to
  [login. If not in a logged in session. Session state contains [username]
  and [password]
*/
var add_authentication = function(app, user_data) {
  app.use(session({
    secret: 'dasdasfafs',
    resave: true,
    saveUninitialized: true}));

  var save_session = function(req, username, password) {
    req.session.username = username;
    req.session.password = password;
    req.session.save();
  }

  var validate_session = function(session) {
    return (session.username &&
	    user_data.password(session.username) === session.password);
  }

  // middleware to redirect not logged in user to login screen. Does not
  // redirect new accout or login traffic which creates a session
  app.use(function(req, res, next) {
    if (req.url === "/login"
	|| req.url === "/new_account"
	|| validate_session(req.session)) {
      next();
    } else {
      res.render("login.html");
    }
  });

  app.get("/new_account", function(req, res) {
    res.render("new-account.html");
  });

  app.get("/login", function(req, res) {
    res.render("login.html");
  });

  // create a new session for the user
  app.post("/login", function(req, res) {
    var username = req.body.username.trim();
    var password = req.body.password;
    if (user_data.password(username) === password) {
      console.log("LOGIN USER:", username);
      save_session(req, username, password);
      res.json({"success": true});
    } else {
      res.json({"success": false});
    }
    res.end();
  });

  // create a new account
  app.post("/new_account", function(req, res) {
    var username = req.body.username.trim();
    var password = req.body.password;
    var email_address = req.body.email_address;
    var email_password = req.body.email_password;
    var success = user_data.add_user(username,
				     password,
				     email_address,
				     email_password);
    console.log("USER", username,
		"CREATED WITH PASSWORD", user_data.password(username));
    save_session(req, username, password);
    res.json({'success': success});
    res.end();
  });

  // log out of a current account. No effect if not logged in
  app.post("/logout", function(req, res) {
    console.log("LOGOUT USER:", req.session.username);
    req.session.destroy();
    res.end();
  });
}

module.exports = add_authentication
