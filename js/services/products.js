app.factory('products', ['$http', function($http) {
    return $http.get('https://sheetsu.com/apis/v1.0/590d2a3b404b')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });
}]);
