var class_dropdown_widget_install = function(dom_container,
					     classes,
					     load_class_display) {
  dom_container.empty();
  classes.forEach(function(class_name) {
    var item = $("<li><a>" + class_name + "</a></li>");
    item.appendTo(dom_container);
    item.click(function() {
      load_class_display(class_name);
    });
  });
}
