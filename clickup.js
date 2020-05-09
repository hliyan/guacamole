/**
 * A fluent API to fetch clickup data to local memory.
 * USAGE: 
 *   $clickup
 *     .auth('key')
 *     .team('Different')
 *     .space('Product - 2020')
 *     .folder('TDTU')
 *     .list('Apr 27 - May 08')
 *     .tasks();
 *   console.log($clickup.current.tasks);
 */
$clickup = function() {
  return this;
}

$clickup.auth = function(key) {
  $clickup.base = 'https://api.clickup.com/api/v2';
  $clickup.headers = {
    Authorization: key, 
    method: 'get', 
    contentType : 
    'application/json; charset=utf-8'
  };
  $clickup.current = {};
  return $clickup;
}

$clickup._fetch = function(path) {
  console.log(path);
  return $http($clickup.base + path, $clickup.headers).data('json');
}

$clickup.team = function(name) {
  $clickup.current.team = null;
  $clickup.current.space = null;
  $clickup.current.folder = null;
  $clickup.current.list = null;
  $clickup.current.tasks = null;
  $clickup.current.error = null;
  
  $clickup._fetch('/team').teams.forEach(function(team) {
    if (team.name === name) {
      $clickup.current.team = team;
    }
  });
  
  if ($clickup.current.team == null) {
    $clickup.current.error = 'Team ' + name + ' could not be set';
  }
  
  return $clickup;
}

$clickup.space = function(name) {
  $clickup.current.space = null;
  $clickup.current.folder = null;
  $clickup.current.list = null;
  $clickup.current.tasks = null;
  $clickup.current.error = null;
  
  $clickup._fetch('/team/' + $clickup.current.team.id + '/space').spaces.forEach(function(space) {
    if (space.name === name) {
      $clickup.current.space = space;
    }
  });
  
  if ($clickup.current.space == null) {
    $clickup.current.error = 'Space ' + name + ' could not be set';
  }
  
  return $clickup;
}

$clickup.folder = function(name) {
  $clickup.current.folder = null;
  $clickup.current.list = null;
  $clickup.current.tasks = null;
  $clickup.current.error = null;
  
  $clickup._fetch('/space/' + $clickup.current.space.id + '/folder').folders.forEach(function(folder) {
    if (folder.name === name) {
      $clickup.current.folder = folder;
    }
  });
  
  if ($clickup.current.folder == null) {
    $clickup.current.error = 'Folder ' + name + ' could not be set';
  }
  
  return $clickup;
}

$clickup.list = function(name) {
  $clickup.current.list = null;
  $clickup.current.tasks = null;
  $clickup.current.error = null;
  
  $clickup._fetch('/folder/' + $clickup.current.folder.id + '/list').lists.forEach(function(list) {
    if (list.name === name) {
      $clickup.current.list = list;
    }
  });
  
  if ($clickup.current.list == null) {
    $clickup.current.error = 'List ' + name + ' could not be set';
  }
  
  return $clickup;
}

$clickup.tasks = function(options = {}) {
  $clickup.current.tasks = null;
  $clickup.current.error = null;
  
  var query = '?';
  var allowedOptions = {
    'subtasks': false, 
    'include_closed': false
  };
  
  for (option in options) {
    if (option in allowedOptions) {
      query += (option + '=' + options[option] + '&');
    }
  }
  
  /*if (options.subtasks) 
    query += 'subtasks=true&';
  if (options.include_closed)
    query += 'include_closed=true&';*/
  
  $clickup.current.tasks = $clickup._fetch('/list/' + $clickup.current.list.id + '/task' + query).tasks;
  
  if ($clickup.current.tasks == null) {
    $clickup.current.error = 'Tasks for list ' + name + ' could not be set';
  }
  
  return $clickup;
}

