function createTask(e, url) {
  e.preventDefault()

  let taskInput = $('#task'),
      input = taskInput.val().trim(),
      task;

  if (input !== '') {
      task = {
          task: input
      };
      taskInput.val('');
      $.ajax({
          url: '/api/create',
          type: 'POST',
          data: task,
          success: function(response) {
              window.location.href = '/';
          },
          error: function(err) {
              console.log(err);
          }
      });
  }
}

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

function editTask(e, id) {
  e.preventDefault()

  let taskInput = $('#editTask'),
      input = taskInput.val().trim(),
      task;

  if (input !== '') {
      task = {
          task: input,
          _id: id
      }
      taskInput.val('');
      $.ajax({
          url: '/api/update',
          type: 'POST',
          data: task,
          success: function(response) {
              window.location.href = '/';
          },
          error: function(err) {
              console.log(err);
          }
      });
  }
}