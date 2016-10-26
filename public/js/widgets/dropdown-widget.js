var dropdown_widget_install = function(dom_container,
				       labels,
				       on_click) {
  dom_container.empty();
  labels.forEach(function(label) {
    var item = $("<li><a>" + label + "</a></li>");
    item.appendTo(dom_container);
    item.click(function() {
      on_click(label);
    });
  });
}
