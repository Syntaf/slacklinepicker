app.factory('products', ['$http', function($http) {
        return $http.get(
            'https://gist.githubusercontent.com/Syntaf/4c6704cbf128228ff50bdb2fd22c825c/raw/2315437999e95af2161e3b38b0721fc77299aea9/slacklineproducts.json')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
