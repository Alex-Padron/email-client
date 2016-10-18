var class_display_widget = function() {
  var dropdown = $("#dropdown");
  var load_class = function(class_name) {
    console.log("loading class name ", class_name);
  }

  var load_class_names = function() {
    var success = function(data) {
      console.log("got classes ", data, "from server");
    }
    var error = function(err) {
      console.log(err);
    }
    $.ajax({
      url: "/classes/class_list",
      type: "GET",
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  }
  load_class_names();

  var class_change_hook = function() {
    load_class_names();
  }
  return class_change_hook;
};
