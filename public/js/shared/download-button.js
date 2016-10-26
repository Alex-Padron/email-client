var download_button = function(text, to_download, file_name) {
  var btn = $("<a>" + text + "</a>");
  btn.attr("href", "data:text/plain;charset=utf-8," + to_download);
  btn.attr("download", file_name);
  var download_container = $("<div style='margin-bottom: 10px'></div>");
  btn.appendTo(download_container);
  return download_container;
}
