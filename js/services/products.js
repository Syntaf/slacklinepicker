app.factory('products', ['$http', function($http) {
        return $http.get(
            'https://gist.githubusercontent.com/Syntaf/4c6704cbf128228ff50bdb2fd22c825c/raw/9048665b124eebc75a4748234223e92ce74e5f33/slacklineproducts.json')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
