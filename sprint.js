function $sprint() {
  return this;
}

// toDates('Jul 3  Jul 13', 2020) => returns an object with the two dates
$sprint.toDates = function(name, year) {
  let dates = name.split('-');
  let start = new Date(Date.parse(dates[0].trim() + ' ' + year + ' UTC'));
  let end = new Date(Date.parse(dates[1].trim() + ' ' + year + ' UTC'));
  return { start: start, end: end };
};

$sprint.columns = {};
$sprint.refs = {};

// reads reference data tab, detects columns and initializes clickup
$sprint.init = function() {
  $.sheet = $('Refs');
  let refDataRange = $('Refs', 'A1:B10');
  $sprint.refs.metricsSheet = $.vlookup(refDataRange, 'Metrics Sheet');
  $sprint.refs.clickupTeam = $.vlookup(refDataRange, 'Clickup Team');
  $sprint.refs.space = $.vlookup(refDataRange, 'Space');
  $sprint.refs.team = $.vlookup(refDataRange, 'Team');
  $sprint.refs.key = $.vlookup(refDataRange, 'Key');
  $sprint.refs.year = $sprint.refs.space.split('-')[0].trim();
  
  $clickup
  .notify(function(e) {
    console.log(e.message);
    if (e.error || e.code) {
      SpreadsheetApp.getUi().alert(e.message);
    }
  })
  .auth($sprint.refs.key)
  .team($sprint.refs.clickupTeam)
  .space($sprint.refs.space)
  .folder($sprint.refs.team);
  
  let metricsColumns = $($sprint.refs.metricsSheet, 'A1:Z1');
  $sprint.columns.SPRINT = $.columnOf('Sprint', metricsColumns);
  $sprint.columns.STATUS = $.columnOf('Status', metricsColumns);
  $sprint.columns.ACTUAL = $.columnOf('Actual', metricsColumns);
  $sprint.columns.UNPLANNED = $.columnOf('Unplanned', metricsColumns);
  $sprint.columns.REWORK = $.columnOf('Rework', metricsColumns);
};

// update each row in the sprint table
$sprint.updateTable = function() {
  $.sheet = $($sprint.refs.metricsSheet);
  
  var doneStates = ['CLOSED', 'READY TO GO LIVE', 'PROD VERIFICATION'];
  var groomedStates = ['READY FOR DEV'];
  var reworkTags = ['PRODUCTION', 'BUG', 'PROBLEM'];
  const firstRow = 2
  const rows = $.sheet.getLastRow() - 1; // minus header
  
  let sprints = $(firstRow, $sprint.columns.SPRINT, rows, $sprint.columns.SPRINT).getValues().flat();
  
  let today = new Date();
  today.setHours(0, 0, 0, 0); // time = 00:00:00.000, for comparison purposes
  
  for (let i = 0; i < sprints.length; i++) {
    if (!sprints[i]) // ignore blanks
      continue;
    
    let sprint = sprints[i];
    let row = firstRow + i;
    let status = '?';
    
    let lastStatus = $(row, $sprint.columns.STATUS).getValue();
    if (lastStatus === 'COMPLETE') { // don't refetch completed sprints
      continue;
    }
    
    let {start, end} = $sprint.toDates(sprint, $sprint.refs.year);
    if (today < start) {
      status = 'TODO';
    } else if (today > end) {
      status = 'COMPLETE'
    } else {
      status = 'IN PROGRESS';
    }
    
    $(row, $sprint.columns.STATUS).setValue(status);
    
    $clickup
      .list(sprint)
      .tasks({subtasks: true, include_closed: true});
    
    $(row, $sprint.columns.ACTUAL).setValue($clickup.calc.actualEffort($clickup.current.tasks, doneStates));
    $(row, $sprint.columns.UNPLANNED).setValue($clickup.calc.unplannedEffort($clickup.current.tasks, start, doneStates));
    $(row, $sprint.columns.REWORK).setValue($clickup.calc.reworkEffort($clickup.current.tasks, reworkTags, doneStates));
  }
};



