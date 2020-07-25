/**
 * Returns a sheet if only one parameter is specified else a range
 *
 * USAGES
 * $('sheet1')
 * $('sheet1', 'A1')
 * $('sheet1', 1, 2)
 * $('sheet1', 1, 2, 10, 10);
 * $.sheet = $('sheet');
 * $(1, 2)
 * $(1, 2, 10, 10)
 */
function $(a, r, s, t, u) {  
  var sheet;
  switch (typeof a) {
    case 'string':
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(a);
      if ((typeof r) == 'undefined') 
        return sheet;
      if ((typeof r) == 'number') {
        if ((typeof t) == 'undefined')
          return sheet.getRange(r, s);
        return sheet.getRange(r, s, t, u);
      } else
        return sheet.getRange(r);
      break;
    case 'number':
      sheet = $.sheet;
      if ((typeof s) == 'undefined')
        return sheet.getRange(a, r);
      return sheet.getRange(a, r, s, t);
      break;
    default:
      sheet = a;
      if ((typeof r) == 'undefined') 
        return sheet;
      if ((typeof r) == 'number') {
        if ((typeof t) == 'undefined')
          return sheet.getRange(r, s);
        return sheet.getRange(r, s, t, u);
      } else
        return sheet.getRange(r);
  }
}

// returns the row number of the cell where $value appears in $range
$.rowOf = function(value, range) {
  let values = range.getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i] == value)
      return range.getRow() + i;
  }
  return -1;
}

// returns the column number of the cell where $value appears in $range
$.columnOf = function (value, range) {
  let values = range.getValues()[0];
  for (let i = 0; i < values.length; i++) {
    if (values[i] == value)
      return range.getColumn() + i;
  }
  return -1;
}

$.vlookup = function(range, name, index = 1) {
  let values = range.getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] == name) {
      return values[i][index];
    }
  }
  return null;
};
