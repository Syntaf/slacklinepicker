app.factory('products', ['$http', function($http) {
        return $http.get(
            'https://gist.githubusercontent.com/Syntaf/4c6704cbf128228ff50bdb2fd22c825c/raw/bf6c44ac440fc49682875ee2a2ebe92418dc9b02/slacklineproducts.json')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
