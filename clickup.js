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

$clickup.notify = function(callback) {
  $clickup._notify = callback;
  return $clickup;
};

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
  $clickup._notify({message:'fetching ' + path});
  var data = $http($clickup.base + path, $clickup.headers).data('json');
  if ($http.error()) {
    $clickup._notify($http.error());
    return null;
  }
  return data;
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
  
  var data = $clickup._fetch('/space/' + $clickup.current.space.id + '/folder');
  data.folders.forEach(function(folder) {
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
  
  var page = 0, limit = 100, data = null;
  $clickup.current.tasks = [];
  
  do {
    data = $clickup._fetch('/list/' + $clickup.current.list.id + '/task' + query + 'page=' + page++);
    $clickup.current.tasks = $clickup.current.tasks.concat(data.tasks);
  } while (data.tasks.length == limit);
  
  return $clickup;
}

$clickup.calc = {};
$clickup.util = {};

$clickup.util.hasTag = function(task, tag) {  
  for (var i in task.tags) {
    if (task.tags[i].name.toUpperCase() === tag)
      return true;
  }
  
  return false;
};

$clickup.util.hasAnyTag = function(task, tags) {  
  for (var i in tags) {
    if ($clickup.util.hasTag(task, tags[i])) {
      return true;
    } 
  }
  
  return false;
};

$clickup.calc.plannedEffort = function(tasks, date) {
  var effort = 0;
  tasks.forEach(function(task) {
    if (task.date_created < date) {
      effort += (task.time_estimate / 3600000);
    }
  });
  return effort;
};

$clickup.calc.actualEffort = function(tasks, doneStates) {
  var effort = 0;
  tasks.forEach(function(task) {
    if (doneStates.includes(task.status.status.toUpperCase())) {
      effort += (task.time_estimate / 3600000);
    }
  });
  return effort;
};


$clickup.calc.unplannedEffort = function(tasks, date, doneStates) {
  var effort = 0;
  tasks.forEach(function(task) {
    if ((task.date_created > date) && (doneStates.includes(task.status.status.toUpperCase()))) {
      effort += (task.time_estimate / 3600000);
    }
  });
  return effort;
};

$clickup.calc.reworkEffort = function(tasks, reworkTags) {
  var effort = 0;
  tasks.forEach(function(task) {
    if ($clickup.util.hasAnyTag(task, reworkTags)) {
      effort += (task.time_estimate / 3600000);
    }
  });
  return effort;
};

