/**
 * Issues an HTTP GET request with given auth token.
 * USAGE: $http('www.something.com', {Authorization: 'token', method: 'get'});
 */
$http = function(url, headers) {  
  $http.response = UrlFetchApp.fetch(url, {
    headers : headers,
    muteHttpExceptions : true
  });
  return $http;
}

/**
 * Get last response data in specified format or as raw text.
 * USAGE:
 * $http.data(), $http.data('json')
 */
$http.data = function(fmt) {
  var data = $http.response.getContentText();
  if ((typeof fmt) == 'undefined')
    return data;
  if (fmt == 'json') {
    $http.jsonData = JSON.parse(data);
    return $http.jsonData;
  }
  return data;
}
