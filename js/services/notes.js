app.factory('notes', ['$http', function($http) {
    return $http.get(
        'https://sheetsu.com/apis/v1.0/d9acf6c52e0b')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });
}]);
