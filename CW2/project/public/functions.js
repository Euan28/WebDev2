//index page functions
//function called to submit the coursework n milestone to the database
//takes the inputted data, the url for the ajax call, and an optional id
function createTask(e, url) {
  e.preventDefault()

  let taskInput = $('#task'),
      input = taskInput.val().trim(),
      task;

  if (input !== '') {
      //creating the inputted data object
      task = {
          task: input
      };
      //clearing the input
      taskInput.val('');
      $.ajax({
          url: '/api/create',
          type: 'POST',
          data: task,
          success: function(response) {
              //reloading the page, this will reflect the changes
              window.location.href = '/';
          },
          error: function(err) {
              console.log(err);
          }
      });
  }
}

//function to remvove uncompleted milestones.  Requires users to confirm deletion
function remove(id) {
  let remove = confirm('Are you sure you want to delete it? You haven\'t even completed it yet!  No one likes a quitter...')
  if (remove) {
      $.ajax({
          url: 'api/task/' + id,
          type: 'DELETE',
          success: function(response) {
              location.reload()
          },
          error: function(err) {
              console.log(err);
          }
      });
  }
}

//function to change milestone from incomplete to complete
function complete(id) {
  $.ajax({
      url: 'api/task/' + id,
      method: 'PUT',
      success: function(result) {
          location.reload();
      },
      error: function(err) {
          console.log(err);
      }
  });
}

//functoin to remove completed milestones.  No confirmation for deletion
function removeCompleted(id) {
  $.ajax({
      url: 'api/task/' + id,
      type: 'DELETE',
      success: function(response) {
          location.reload();
      },
      error: function(err) {
          console.log(err);
      }
  })
}

//edit page functions
//function that is called to edit the name of a milestone/coursework
function editTask(e, id) {
  e.preventDefault()

  let taskInput = $('#editTask'),
      input = taskInput.val().trim(),
      task;

  if (input !== '') {
      //creating the milestone object
      task = {
          task: input,
          _id: id
      }
      //clearing the inputted value
      taskInput.val('');
      $.ajax({
          url: '/api/update',
          type: 'POST',
          data: task,
          success: function(response) {
              //redirecting
              window.location.href = '/';
          },
          error: function(err) {
              console.log(err);
          }
      });
  }
}