const FIRST_TABLE_ROW = 5,
    FOLDER_COLUMN = 1,
    LIST_COLUMN = 2,
    START_DATE_COLUMN = 3,
    END_DATE_COLUMN = 4,
    PLANNED_COLUMN = 5,
    ACTUAL_COLUMN = 6,
    UNPLANNED_COLUMN = 7,
    REWORK_COLUMN = 8,
    PO_COLUMN = 14,
    UI_COLUMN = 15,
    TECH_COLUMN = 16,
    EST_COLUMN = 17,
    PLAN_COLUMN = 18,
    QUALITY_COLUMN = 19,
    CODE_COLUMN = 20,
    GOALS_COLUMN = 21,
    OVERALL_COLUMN = 22;

const RETRO_TEAM_COLUMN = 3,
    RETRO_SPRINT_COLUMN = 4,
    RETRO_PO_COLUMN = 6,
    RETRO_UI_COLUMN = 7,
    RETRO_TECH_COLUMN = 8,
    RETRO_EST_COLUMN = 9,
    RETRO_PLAN_COLUMN = 10,
    RETRO_QUALITY_COLUMN = 11,
    RETRO_CODE_COLUMN = 12,
    RETRO_GOALS_COLUMN = 13,
    RETRO_OVERALL_COLUMN = 14;

function getSelectedSprintRow() {
  var row = $('Metrics').getCurrentCell().getRow();
  row = (row < FIRST_TABLE_ROW) ? FIRST_TABLE_ROW : row; // in script mode, default to first row since getCurrentCell doesn't work
  return row;
}

/**
 * Updates the sprint metrics for the currently selected row.
 * Note: when run in script editor, no selected row, so it defaults to first row. 
 */
function updateSprintMetrics() {
  var row = getSelectedSprintRow();
  
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
  
  updateRetros();
}

function updateRetros() {
  var row = getSelectedSprintRow();
  $.sheet = $('Metrics');
  var team = $(row, FOLDER_COLUMN).getValue();
  var sprint = $(row, LIST_COLUMN).getValue();
  
  var retroSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Retros');
  var filter = retroSheet.getFilter();
  
  filter.setColumnFilterCriteria(RETRO_TEAM_COLUMN, SpreadsheetApp.newFilterCriteria().whenTextEqualTo(team).build());
  filter.setColumnFilterCriteria(RETRO_SPRINT_COLUMN, SpreadsheetApp.newFilterCriteria().whenTextEqualTo(sprint).build());
  
  $.sheet = retroSheet;
  var poAverage = $(1, RETRO_PO_COLUMN).getValue();
  var uiAverage = $(1, RETRO_UI_COLUMN).getValue();
  var techAverage = $(1, RETRO_TECH_COLUMN).getValue();
  var estAverage = $(1, RETRO_EST_COLUMN).getValue();
  var planAverage = $(1, RETRO_PLAN_COLUMN).getValue();
  var qualityAverage = $(1, RETRO_QUALITY_COLUMN).getValue();
  var codeAverage = $(1, RETRO_CODE_COLUMN).getValue();
  var goalsAverage = $(1, RETRO_GOALS_COLUMN).getValue();
  var overallAverage = $(1, RETRO_OVERALL_COLUMN).getValue();
  
  $.sheet = $('Metrics');
  $(row, PO_COLUMN).setValue(poAverage);
  $(row, UI_COLUMN).setValue(uiAverage);
  $(row, TECH_COLUMN).setValue(techAverage);
  $(row, EST_COLUMN).setValue(estAverage);
  $(row, PLAN_COLUMN).setValue(planAverage);
  $(row, QUALITY_COLUMN).setValue(qualityAverage);
  $(row, CODE_COLUMN).setValue(codeAverage);
  $(row, GOALS_COLUMN).setValue(goalsAverage);
  $(row, OVERALL_COLUMN).setValue(overallAverage);
  
  filter.removeColumnFilterCriteria(RETRO_TEAM_COLUMN);
  filter.removeColumnFilterCriteria(RETRO_SPRINT_COLUMN);
  
}




