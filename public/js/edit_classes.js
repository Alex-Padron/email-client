$(document).ready(function () {
  $('.dropdown-toggle').dropdown();
  var creating_class = false;
  var edit_class = $("#edit_class");

  var class_change_hook = class_display_widget();

  var cancel_hook = function() {
    creating_class = false;
  }

  var success_hook = function() {
    creating_class = false;
    class_change_hook();
  }
  $("#new_class").click(function() {
    if (creating_class) return;
    creating_class = true;
    create_class_widget(edit_class, success_hook, cancel_hook);
  });
});
