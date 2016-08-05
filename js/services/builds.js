app.factory('builds', ['$http', function($http) {
    return $http.get(
        '')//'https://sheetsu.com/apis/v1.0/d9acf6c52e0b/sheets/BuildsAPI')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });
}]);
