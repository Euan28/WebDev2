$(document).ready(function() {


//index page events
//click even for creating a milestone/coursework
  $('#create').on('click', function(e) {
      createTask(e);
  });

//keypress event that allows milestone?coursework to be created on 'Enter'
  $('#task').keypress(function(e) {
      if (e.key === 'Enter') {
          createTask(e);
      }
  });

//click event to change the state of the milestone to be completed
  $('.complete').on('click', function(e) {
      e.preventDefault();
      let id = $(this).data('id');
      complete(id);
  });

//click event for deleting uncomplement milestones
  $('.delete').on('click', function(e) {
      let id = $(this).data('id');
      remove(id);
  });

//click event for completed milestones that bypasses the confirm
  $('.delcomplete').on('click', function(e) {
      let id = $(this).data('id');
      removeCompleted(id);
  });

//edit page events
//click event t load the edit milestone page
  $('.edit').on('click', function(e) {
      let id = $(this).data('id');
      window.location.href = '/api/task/' + id;
  });

//click event to submit the edit to the back-end
  $('#edit').on('click', function(e) {
      let id = $(this).data('id');
      editTask(e, id)
  });

//keypress event that allows milestones to be edited on 'Enter'
  $('#editTask').keypress(function(e) {
      let id = $('#editTask').data('id');
      if (e.key === 'Enter') {
          editTask(e, id)
      }
  });

});