$(document).ready(function () {
  $('.dropdown-toggle').dropdown();
  var creating_class = false;
  var edit_class = $("#edit_class");

  var load_class_display = function(class_name) {
    var success = function(students) {
      class_display_widget($("#class_widget_display"),
			   class_name,
			   students,
			   load_class_dropdown);
    }
    var error = function(err) {
      console.log(err);
    }
    $.ajax({
      url: "/classes/single/" + class_name,
      type: "GET",
      success: success,
      error: error,
      timeout: 2000,
      contentType: "application/json",
    });
  }

  var load_class_dropdown = function() {
    var success = function(classes) {
      dropdown_widget_install($("#dropdown"),
			      classes,
			      load_class_display);
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

  var cancel_hook = function() {
    creating_class = false;
  }

  var success_hook = function() {
    creating_class = false;
    load_class_dropdown();
  }

  $("#new_class").click(function() {
    if (creating_class) return;
    creating_class = true;
    create_class_widget(edit_class, success_hook, cancel_hook);
  });

  load_class_dropdown();
});
