function update() {  
  var row = 6;
  var maxCols = 6;
  var maxRows = 300;
  $.sheet = $('Tasks');
  $(row, 1, maxRows, maxCols).clear();
  $(row, 2).setValue('Fetching...');
  
  var team   = $(1,2).getValue();
  var space  = $(2,2).getValue();
  var folder = $(3,2).getValue();
  var list   = $(4,2).getValue();
  var key    = $('Ref', 'B1').getValue();
    
  // fetch
  $clickup
  .auth(key)
  .team(team)
  .space(space)
  .folder(folder)
  .list(list)
  .tasks({subtasks: true, include_closed: true});

  // display
  $(row,1).setValue('Task ID');
  $(row,2).setValue('Task Name');
  $(row,3).setValue('Task Status');
  $(row,4).setValue('Estimate');
  $(row,5).setValue('Parent');
  $(row, 1, 1, 5).setFontWeight('bold');
  
  $clickup.current.tasks.forEach(function(task) {
    $(++row,1).setFormula('=HYPERLINK("' + task.url + '","' + task.id +'")');
    $(row,2).setValue(task.name);
    $(row,3).setValue(task.status.status.toUpperCase());  
    $(row,4).setValue(task.time_estimate/(3600*1000));
    $(row,5).setValue(task.parent);
  });
}

function updateSprintMetrics() {
  var row = $('Metrics').getCurrentCell().getRow(); // 1=team, 2=sprint, 3=start date, 4=end date
  row = (row == 1) ? 4 : row; // in script mode, default to first row since getCurrentCell doesn't work
  
  $.sheet = $('Metrics');
  var team = $(1, 2).getValue();
  var space = $(2, 2).getValue();
  var folder = $(row,1).getValue();
  var list = $(row, 2).getValue();
  var start = new Date($(row, 3).getValue());
  var end = new Date($(row, 4).getValue());
  var key = $('Ref', 'B1').getValue();
  var messageCell = $('Metrics', 'D1');
  var doneStates = ['CLOSED', 'READY TO GO LIVE', 'PROD VERIFICATION'];
  
  // fetch
  $clickup
  .notify(function(e) {
    messageCell.setValue(e.message);
    console.log(e.message);
  })
  .auth(key)
  .team(team)
  .space(space)
  .folder(folder)
  .list(list)
  .tasks({subtasks: true, include_closed: true});
  
  $(row, 5).setValue($clickup.calc.plannedEffort($clickup.current.tasks, start.getTime()));
  $(row, 6).setValue($clickup.calc.actualEffort($clickup.current.tasks, doneStates));
  $(row, 7).setValue($clickup.calc.unplannedEffort($clickup.current.tasks, start.getTime(), doneStates));
  
  messageCell.setValue('');
}





