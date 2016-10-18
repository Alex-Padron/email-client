$(function() {
  // regardless of whether we log out successfully jump to the
  // home page. If we did logout, this will redirect to login,
  // if not, the server is probably down so it won't matter.
  var success = function() { window.location.href = "/"; }
  var error   = function() { window.location.href = "/"; }

  $("#logout").click(function() {
    $.ajax({
      url: "/logout",
      type: "POST",
      async: true,
      success: success,
      error: error,
    });
  });
});
