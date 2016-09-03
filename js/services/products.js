app.factory('products', ['$http', function($http) {
        return $http.get(
            'https://gist.githubusercontent.com/Syntaf/aaeda8682a39928daf038cab746c392a/raw/0a4f3b9d5752195bf7e5470116a1224e9d311e34/betaproducts.json')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                return err;
            });
}]);
