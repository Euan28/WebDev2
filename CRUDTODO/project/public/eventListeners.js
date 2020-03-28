$(document).ready(function (){
  
  //==========================================================
  //Main Page Events
  //==========================================================
  
  //click event for creating a task
  $('#create').on('click', function(e){
    createTask(e);
  });

  //keypress event that allows task to be created on 'Enter'
  $('#task').keypress(function(e){
    if (e.key === 'Enter'){
      createTask(e);
    }
  });

  //click event to change state of task to completed
  $('.complete').on('click', function (e){
    e.preventDefault();
    let id = $(this).data('id');
    complete(id);
  });

  //click event for deleting uncompleted events
  $('.delete').on('click', function(e){
    let id = $(this).data('id');
    remove(id);
  });

  //click event for completed events that bypasses the confirm
  $('.delcomplete').on('click', function(e){
    let id = $(this).data('id');
    removeCompleted(id);
  });



  //==========================================================
  //Edit Page Events
  //==========================================================
  

  //click event to load the edit task page
  $('.edit').on('click', function(e){
    let id = $(this).data('id');
    window.location.href = '/api/task/'+ id;
  });

  //click event to submit the edit to the back end
  $('#edit').on('click', function(e){
    let id = $(this).data('id');
    editTask(e, id)
  });

  //keypress event that allows task to be edited on 'Enter'
  $('#editTask').keypress(function(e){
    let id = $('#editTask').data('id');
    if (e.key === 'Enter'){
      editTask(e, id)
    }
  });
  
});//end of document ready function

