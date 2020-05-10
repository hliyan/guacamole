# Guacamole

<strong>G</strong>oogle <strong>A</strong>ppScript for the <strong>C</strong>lickup API.

# Contents

## sheets.js

This is an old-fashioned jQuery-like Google AppScript API for cell access in Google Sheets. Meant for ease of use by non-develoeprs:

E.g.
```
 $('sheet1')
 $('sheet1', 'A1')
 $('sheet1', 1, 2)
 $('sheet1', 1, 2, 10, 10);
 $.sheet = $('sheet');
 $(1, 2)
 $(1, 2, 10, 10)
```

## http.js

A thin wrapper over Google AppScript `UrlFetchApp.fetch`.

E.g.
```
let data = $http('www.something.com', {Authorization: 'token', method: 'get'}).data('json');
```

## clickup.js

A fluent Google AppScript wrapper for the Clickup API.

E.g.
```
    $clickup
      .auth('key')
      .team('Different')
      .space('Product - 2020')
      .folder('TDTU')
      .list('Apr 27 - May 08')
      .tasks();
    console.log($clickup.current.tasks);
```

## Code.js

A sample implementation.
