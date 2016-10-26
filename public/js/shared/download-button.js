var download_button = function(text, to_download) {
  var btn = $("<a>Download Sample Students File</a>");
  download_button.attr("href", "data:text/plain;charset=utf-8," +
		       encodeURIComponent(sample_students_file));
  download_button.attr("download", "sample-students.txt");
  var download_container = $("<div style='margin-bottom: 10px'></div>");
  download_button.appendTo(download_container);
  
}
