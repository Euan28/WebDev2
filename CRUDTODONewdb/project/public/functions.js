//================================================
//Main Page Functions
//================================================

//function that is called to submit task to the database
//takes the event, the url for the ajax call, and an optional id
function createTask(e, url){
  e.preventDefault()
  
  let taskInput = $('#task'),
      input = taskInput.val().trim(),
      task;

  if (input !== '') {
    //creating task object
    task = {
      task: input
    };
    //clearing input
    taskInput.val('');
    $.ajax({
      url: '/api/create',
      type: 'POST',
      data: task,
      success: function (response){
        //reloading the page to reflect changes
        window.location.href = '/';  
      },
      error: function (err){
        console.log(err);
      }
    });
  }
}

//function to remvove uncompleted tasks.  Requires users to
//confirm deletion
function remove(id){
  let remove = confirm('Are you sure you want to delete it? You haven\'t even completed it yet!  No one likes a quitter...')
  if (remove){
    $.ajax({
      url: 'api/task/'+id,
      type: 'DELETE',
      success: function (response){
        location.reload()
      },
      error: function (err){
        console.log(err);
      }
    });
  }
}

//function to change task from incomplete to complete
function complete(id){
  $.ajax({
    url: 'api/task/'+id,
    method: 'PUT',
    success: function (result){
      location.reload();
    },
    error: function (err){
      console.log(err);
    }
  });
}

//functoin to remove completed tasks.  No confirmation for deletion
function removeCompleted(id){
  $.ajax({
    url: 'api/task/'+id,
    type: 'DELETE',
    success: function (response){
      location.reload();
    },
    error: function (err){
      console.log(err);
    }
  })
}


//================================================
//Edit Page Functions
//================================================


//function that is called to edit the name of a task
function editTask(e, id){
  e.preventDefault()

  let taskInput = $('#editTask'),
      input = taskInput.val().trim(),
      task;

  if (input !== '') {
    //creating task object
    task = {
      task: input,
      _id: id
    }
    //clearing inputs
    taskInput.val('');
    $.ajax({
      url: '/api/update',
      type: 'POST',
      data: task,
      success: function (response){
        //redirecting back to the main page
        window.location.href = '/';  
      },
      error: function (err){
        console.log(err);
      }
    });
  }
} 
