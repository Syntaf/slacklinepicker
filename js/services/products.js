app.factory('products', ['$http', function($http) {
        return $http.get(
            'https://gist.githubusercontent.com/Syntaf/4c6704cbf128228ff50bdb2fd22c825c/raw/2e0dff305f80f15eb2d9a9257d5f402be7a8a927/slacklineproducts.json')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
