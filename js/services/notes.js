app.factory('notes', ['$http', function($http) {
    return $http.get(
        '') // note API has been removed as I no longer pay for the sheetsu membership
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });
}]);
