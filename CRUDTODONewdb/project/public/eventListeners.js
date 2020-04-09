$(document).ready(function() {

  $('#create').on('click', function(e) {
      createTask(e);
  });

  $('#task').keypress(function(e) {
      if (e.key === 'Enter') {
          createTask(e);
      }
  });

  $('.complete').on('click', function(e) {
      e.preventDefault();
      let id = $(this).data('id');
      complete(id);
  });

  $('.delete').on('click', function(e) {
      let id = $(this).data('id');
      remove(id);
  });

  $('.delcomplete').on('click', function(e) {
      let id = $(this).data('id');
      removeCompleted(id);
  });

  $('.edit').on('click', function(e) {
      let id = $(this).data('id');
      window.location.href = '/api/task/' + id;
  });

  $('#edit').on('click', function(e) {
      let id = $(this).data('id');
      editTask(e, id)
  });

  $('#editTask').keypress(function(e) {
      let id = $('#editTask').data('id');
      if (e.key === 'Enter') {
          editTask(e, id)
      }
  });

});