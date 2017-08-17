# Email Client

Extension of the email client project in my main repository for hosting
as a web server

## Email Access:
This service takes your username and password for email. There is no way for
users to extract your password using this website, even if they are logged in
as you. However, by submitting your username and password you are trusting
Heroku to keep it secure.

Addtionally, in order to allow Heroku to send emails on your behalf, you have
to enable less secure apps at `https://myaccount.google.com/lesssecureapps`

## TODO:
fix login to not lose username/password
fix class dropdown if no classes
button spacing
flip order of class and email buttons