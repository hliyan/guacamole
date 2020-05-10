/**
 * Updates the sprint metrics for the currently selected row.
 * Note: when run in script editor, no selected row, so it defaults to first row. 
 */
function updateSprintMetrics() {
  const FIRST_TABLE_ROW = 5,
      FOLDER_COLUMN = 1,
      LIST_COLUMN = 2,
      START_DATE_COLUMN = 3,
      END_DATE_COLUMN = 4,
      PLANNED_COLUMN = 5,
      ACTUAL_COLUMN = 6,
      UNPLANNED_COLUMN = 7,
      REWORK_COLUMN = 8,
      GROOMED_COLUMN = 9;

  
  var row = $('Metrics').getCurrentCell().getRow();
  row = (row < FIRST_TABLE_ROW) ? FIRST_TABLE_ROW : row; // in script mode, default to first row since getCurrentCell doesn't work
  
  $.sheet = $('Metrics');
  var team = $(1, 2).getValue();
  var space = $(2, 2).getValue();
  var folder = $(row, FOLDER_COLUMN).getValue();
  var list = $(row, LIST_COLUMN).getValue();
  var start = new Date($(row, START_DATE_COLUMN).getValue());
  var end = new Date($(row, END_DATE_COLUMN).getValue());
  var key = $('Ref', 'B1').getValue();
  var messageCell = $('Metrics', 'F1');
  var doneStates = ['CLOSED', 'READY TO GO LIVE', 'PROD VERIFICATION'];
  var groomedStates = ['READY FOR DEV'];
  var reworkTags = ['PRODUCTION', 'BUG', 'PROBLEM'];
  var today = new Date();
  var notify = function(e) {
    messageCell.setValue(e.message);
    console.log(e.message);
  };
  
  // fetch sprint
  $clickup
  .notify(notify)
  .auth(key)
  .team(team)
  .space(space)
  .folder(folder)
  .list(list)
  .tasks({subtasks: true, include_closed: true});
  
  // don't update after sprint start
  if (today - start < (1000 * 3600 * 24)) { 
    $(row, PLANNED_COLUMN).setValue($clickup.calc.plannedEffort($clickup.current.tasks, start));
  }
  
  $(row, ACTUAL_COLUMN).setValue($clickup.calc.actualEffort($clickup.current.tasks, doneStates));
  $(row, UNPLANNED_COLUMN).setValue($clickup.calc.unplannedEffort($clickup.current.tasks, start, doneStates));
  $(row, REWORK_COLUMN).setValue($clickup.calc.reworkEffort($clickup.current.tasks, reworkTags, doneStates));
    
  notify({message: ''});
}





