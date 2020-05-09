function initUI() {
  SpreadsheetApp.getUi()
    .createMenu('Clickup')
    .addItem('Update', 'update')
  .addToUi();
}

function update() {  
  var row = 6;
  var maxCols = 6;
  var maxRows = 300;
  $.sheet = $('Sheet1');
  $(row, 1, maxRows, maxCols).clear();
  $(row, 2).setValue('Fetching...');
  
  var team   = $(1,2).getValue();
  var space  = $(2,2).getValue();
  var folder = $(3,2).getValue();
  var list   = $(4,2).getValue();
  var key    = $('Ref', 'B1').getValue();
    
  $clickup
  .auth(key)
  .team(team)
  .space(space)
  .folder(folder)
  .list(list)
  .tasks({subtasks: true, include_closed: true});

  $(row,1).setValue('Task ID');
  $(row,2).setValue('Task Name');
  $(row,3).setValue('Task Status');
  $(row,4).setValue('Estimate');
  $(row,5).setValue('Parent');
  $(row,6).setValue('Url');
  $clickup.current.tasks.forEach(function(task) {
    $(++row,1).setValue(task.id);
    $(row,2).setValue(task.name);
    $(row,3).setValue(task.status.status.toUpperCase());  
    $(row,4).setValue(task.time_estimate/(3600*1000));
    $(row,5).setValue(task.parent);
    $(row,6).setValue(task.url);
  });
}






