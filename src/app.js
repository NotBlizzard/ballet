// Because I'm lazy.
$(document).ready(function() {
  $('.answer').click(function(e) {
    $('#'+this.id+'-link').trigger('click');
        e.stopImmediatePropagation();
//.trigger('click');
  });
});